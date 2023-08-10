import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';

import fastifyCors from '@fastify/cors';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { User }  from '../modules/user/user.dto'

export const app = fastify({
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

export const buildContext = async ({
  request,
  reply,
  connectionParams,
}: {
  request?: FastifyRequest;
  reply?: FastifyReply;
  connectionParams?: {
    Authorization: string;
  };
}) => {
   type CtxUser = Omit<User, 'password'>;

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
};

export type Context = Awaited<ReturnType<typeof buildContext>>;
