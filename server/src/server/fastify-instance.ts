import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'

import fastifyCors from '@fastify/cors'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { User } from '../modules/user/user.dto'

export const app = fastify({
  logger: false,
})

app.register(fastifyCors, {
  credentials: true,
  origin: (origin, cb) => {
    if (
      !origin ||
      ['http://localhost:3000', 'https://studio.apollographql.com'].includes(
        origin
      )
    ) {
      return cb(null, true)
    }

    return cb(new Error('Not allowed'), false)
  },
})

app.register(fastifyCookie, {
  parseOptions: {},
})

app.register(fastifyJwt, {
  secret: 'change-me',
  cookie: {
    cookieName: 'token',
    signed: false,
  },
})

export const buildContext = async ({
  request,
  reply,
  connectionParams,
}: {
  request?: FastifyRequest
  reply?: FastifyReply
  connectionParams?: {
    Authorization: string
  }
}) => {
  type CtxUser = Omit<User, 'password'> & { roles: string[] }

  if (connectionParams || !request) {
    try {
      let user = app.jwt.verify<CtxUser>(connectionParams?.Authorization || '')

      user.roles = user.isAdmin ? ['admin123'] : ['user']; 

      return {
        user,
      }
    } catch (e) {
      return { user: null }
    }
  }

  try {
    let user = await request.jwtVerify<CtxUser>()
    user.roles = user.isAdmin ? ['admin123'] : ['user']; 

    return { request, reply, user }
  } catch (e) {
    return { request, reply, user: null }
  }
}

export type Context = Awaited<ReturnType<typeof buildContext>>
