import { buildSchema } from 'type-graphql';
import UserResolver from '../modules/user/user.resolver';
import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fastifyCors from '@fastify/cors';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { GraphQLSchema, execute, subscribe } from 'graphql';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import { User } from '@prisma/client';
import { bearerAuthChecker } from './bearer-auth-checker';
import MessageResolver from '../modules/message/message.resolver';

const app = fastify({
  logger: true,
});

app.register(fastifyCors, {
  credentials: true,
  origin: (origin, cb) => {
    if (
      !origin ||
      ['http://localhost:3000', 'https://studio.apollographql.com'].includes(
        origin
      )
    ) {
      return cb(null, true);
    }

    return cb(new Error('Not allowed'), false);
  },
});

app.register(fastifyCookie, {
  parseOptions: {},
});

app.register(fastifyJwt, {
  secret: 'change-me',
  cookie: {
    cookieName: 'token',
    signed: false,
  },
});

async function buildContext({
  request,
  reply,
  connectionParams,
}: {
  request?: FastifyRequest;
  reply?: FastifyReply;
  connectionParams?: {
    Authorization: string;
  };
}) {
  if (connectionParams || !request) {
    try {
      return {
        user: app.jwt.verify<CtxUser>(connectionParams?.Authorization || ''),
      };
    } catch (e) {
      return { user: null };
    }
  }

  try {
    const user = await request.jwtVerify<CtxUser>();
    return { request, reply, user };
  } catch (e) {
    return { request, reply, user: null };
  }
}

type CtxUser = Omit<User, 'password'>;

export type Context = Awaited<ReturnType<typeof buildContext>>;

export async function createServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver, MessageResolver],
    authChecker: bearerAuthChecker,
  });

  const server = new ApolloServer({
    schema,
    plugins: [
      fastifyAppClosePlugin(app),
      ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
    ],
    context: buildContext,
  });
  subscriptionServer({ schema, server: app.server });
  return { app, server };
}

function fastifyAppClosePlugin(app: FastifyInstance): ApolloServerPlugin {
  return {
    async serverWillStart() {
      console.log('Server will start');
      return {
        async drainServer() {
          console.log('Drain server');
          await app.close();
        },
      };
    },
  };
}

const subscriptionServer = ({
  schema,
  server,
}: {
  schema: GraphQLSchema;
  server: typeof app.server;
}) => {
  return SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      async onConnect(connectionParams: { Authorization: string }) {
        return buildContext({ connectionParams });
      },
    },
    {
      server,
      path: '/graphql',
    }
  );
};
