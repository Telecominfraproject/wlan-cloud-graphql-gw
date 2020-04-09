import { ApolloServer } from 'apollo-server';
import { API } from './datasource';

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// For Self Signed Certificates in development
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

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

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
