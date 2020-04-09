const { gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Query {
    me: User
    findCustomer: [Customer]
  }

  type User {
    id: String!
    email: String!
  }

  type Customer {
    id: String!
  }

  type Token {
    access_token: String!
    refresh_token: String!
    expires_in: String!
  }

  type Mutation {
    authenticateUser(email: String!, password: String!): Token
    updateToken(refreshToken: String!): Token
  }
`;

module.exports = typeDefs;
