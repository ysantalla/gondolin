import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { createServer } from 'http';
import { MemcachedCache } from 'apollo-server-cache-memcached';

import { Prisma } from './generated/prisma';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers
})

const app = express();

const db = new Prisma({
  debug: true,
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET
});

app.get('/download/:id', async (req, res) => {
  const file = await db.query.file({where: {id: req.params.id}});

  if (file) {
    const filePath = path.join(__dirname, file.path);
    if (fs.existsSync(filePath)) {
      res.header('Content-disposition', 'inline; filename=' + file.filename);
      res.header('Content-type', file.mimetype);
      res.download(filePath, file.filename); 
    } else {
      res.send("File not found");
    }      
  } else {
    res.send("Error file not found1");
  }    
});


const server = new ApolloServer({
  schema: schema,
  context: async ({ req, res }) => {
    
    return {
      req,
      res,
      db
    };
  },
  cache: new MemcachedCache(
    ['memcached-server-1', 'memcached-server-2', 'memcached-server-3'],
    { retries: 10, retry: 10000 }
  ),
  debug: true,
  subscriptions: {
    onConnect: (connectionParams: any, webSocket, context) => {
      console.log(context.request.headers);

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

httpServer.listen(process.env.PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${
      server.subscriptionsPath
    }`
  );
});
