import { SubscriptionServer } from 'subscriptions-transport-ws';
import { GraphQLSchema, execute, subscribe } from 'graphql';
import { FastifyInstance } from 'fastify';
import { buildContext } from './fastify-instance';

export const createSubscriptionServer = async ({
    schema,
    app,
  }: {
    schema: GraphQLSchema;
    app:  FastifyInstance;
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
        server: app.server,
        path: '/graphql',
      }
    );
  };