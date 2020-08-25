const express = require('express');
const { ApolloServer } = require('apollo-server-express');

import { API } from './datasource';
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// For Self Signed Certificates in development
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const app = express();

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    api: new API(),
  }),
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    return { token };
  },
});

// Apply Middleware
server.applyMiddleware({
  app,
  path: '/graphql',
  bodyParserConfig: {
    limit: '10mb',
  },
});

// The `listen` method launches a web server.
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
