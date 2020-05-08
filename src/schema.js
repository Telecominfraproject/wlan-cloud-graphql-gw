const { gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Query {
    getUser(id: Int!): User
    deleteUser(id: Int!): User
    getAllUsers(customerId: Int!): [User]

    getCustomer(id: Int!): Customer
    findCustomer: [Customer]

    getLocation(id: Int!): Location
    deleteLocation(id: Int!): Location
    getAllLocations(customerId: Int!): [Location]
  }

  type User {
    id: Int!
    username: String!
    password: String
    role: String!
  }

  type Customer {
    id: Int!
    name: String!
  }

  type Token {
    access_token: String!
    refresh_token: String!
    expires_in: String!
  }

  type Location {
    id: Int!
    locationType: String!
    customerId: Int!
    parentId: Int!
    name: String!
  }

  type Mutation {
    authenticateUser(email: String!, password: String!): Token
    updateToken(refreshToken: String!): Token

    createUser(
      username: String!
      password: String!
      role: String!
    ): User
    updateUser(
      id: Int!
      username: String!
      password: String!
      role: String!
    ): User

    createLocation(
      locationType: String!
      customerId: Int!
      parentId: Int!
      name: String!
    ): Location
    updateLocation(
      id: Int!
      locationType: String!
      customerId: Int!
      parentId: Int!
      name: String!
    ): Location
  }
`;

module.exports = typeDefs;
