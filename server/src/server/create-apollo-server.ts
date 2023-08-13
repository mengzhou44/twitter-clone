import { buildSchema } from 'type-graphql';
import path from 'path'; 
import { FastifyInstance } from 'fastify';
import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { AuthChecker } from 'type-graphql';
import { buildContext, Context} from './fastify-instance';
 
export async function createApolloServer(app: FastifyInstance) {
 
  const bearerAuthChecker: AuthChecker<Context> = ({ context }) => {
    if (context.user) {
      return true;
    }
    return false;
  };
 
  const schema = await buildSchema({
    resolvers: [path.join(__dirname, '../modules/**/*.resolver.{ts,js}')],
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

  return { server, schema };
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
