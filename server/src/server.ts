import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { MemcachedCache } from 'apollo-server-cache-memcached';

import { CONFIG } from './config';
import { Prisma } from './generated/prisma';

import { resolvers } from './resolvers';
import { typeDefs } from './schemas';

import { getAuthUser } from './utils'

const app = express();

const db = new Prisma({
  debug: true,
  endpoint: CONFIG.PRISMA_URL,
  secret: CONFIG.PRISMA_SECRET
});

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: async ({ req, res }) => {
    const auth: any = getAuthUser(req);

    console.log(auth);
    return {
      req,
      res,
      db,
      auth
    };
  },
  cache: new MemcachedCache(
    ['memcached-server-1', 'memcached-server-2', 'memcached-server-3'],
    { retries: 10, retry: 10000 }
  ),
  debug: true,
  subscriptions: {
    onConnect: (connectionParams: any, webSocket, context) => {
      console.log('connect');

      console.log(connectionParams.authToken);
    },
    onDisconnect: (webSocket, context) => {
      console.log('disconnet');
    },
    path: '/subscriptions'
  }
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(CONFIG.PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${CONFIG.PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${CONFIG.PORT}${
      server.subscriptionsPath
    }`
  );
});
