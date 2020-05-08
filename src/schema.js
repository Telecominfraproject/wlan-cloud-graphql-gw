const { gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Query {
    me: User

    getCustomer(customerId: String!): Customer
    findCustomer: [Customer]

    getLocation(locationId: String!): Location
    deleteLocation(locationId: String!): Location
    getAllLocations(customerId: String!): [Location]
  }

  type User {
    email: String!
    role: String!
  }

  type Customer {
    id: String!
    name: String!
  }

  type Token {
    access_token: String!
    refresh_token: String!
    expires_in: String!
  }

  type Location {
    id: String!
    locationType: String!
    customerId: String!
    parentId: String!
    name: String!
  }

  type Mutation {
    authenticateUser(email: String!, password: String!): Token
    updateToken(refreshToken: String!): Token

    createLocation(
      id: String
      locationType: String!
      customerId: String!
      parentId: String!
      name: String!
    ): Location
    updateLocation(
      id: String
      locationType: String!
      customerId: String!
      parentId: String!
      name: String!
    ): Location
  }
`;

module.exports = typeDefs;
