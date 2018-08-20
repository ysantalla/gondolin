import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { createServer } from 'http';
import { MemcachedCache } from 'apollo-server-cache-memcached';

import { CONFIG } from './config';
import { Prisma } from './generated/prisma';
import { getAuthUser } from './utils'

import { resolvers } from './resolvers';
import { typeDefs } from './schemas';

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers
})

const app = express();

const db = new Prisma({
  debug: true,
  endpoint: CONFIG.PRISMA_URL,
  secret: CONFIG.PRISMA_SECRET
});


app.get('/download/:id', async (req, res) => {
  const file = await db.query.file({where: {id: req.params.id}});
  const filePath = path.join(__dirname, file.path);
  res.download(filePath, file.filename); 
});


const server = new ApolloServer({
  schema: schema,
  context: async ({ req, res }) => {
    const user: any = getAuthUser(req);
    return {
      req,
      res,
      db,
      user
    };
  },
  cache: new MemcachedCache(
    ['memcached-server-1', 'memcached-server-2', 'memcached-server-3'],
    { retries: 10, retry: 10000 }
  ),
  debug: false,
  subscriptions: {
    onConnect: (connectionParams: any, webSocket, context) => {
      console.log('connect');

      //webSocket.close();

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
