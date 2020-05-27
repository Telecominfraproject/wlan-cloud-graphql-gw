const { gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  scalar JSONObject

  type Query {
    getUser(id: Int!): User
    deleteUser(id: Int!): User
    getAllUsers(customerId: Int!, cursor: String, limit: Int): UserPagination

    getCustomer(id: Int!): Customer
    findCustomer: [Customer]

    getLocation(id: Int!): Location
    deleteLocation(id: Int!): Location
    getAllLocations(customerId: Int!): [Location]

    getEquipment(id: Int!): Equipment
    deleteEquipment(id: Int!): Equipment
    getAllEquipment(customerId: Int!): EquipmentPagination
    filterEquipment(
      customerId: Int!
      locationIds: [Int]
      equipmentType: String
      cursor: String
      limit: Int
    ): EquipmentPagination
  }

  type PaginationContext {
    model_type: String!
    maxItemsPerPage: Int!
    lastReturnedPageNumber: Int
    totalItemsReturned: Int
    lastPage: Boolean
    cursor: String
  }

  type User {
    id: Int!
    username: String!
    password: String
    role: String!
    customerId: Int!
    lastModifiedTimestamp: String
  }

  type UserPagination {
    items: [User]
    context: PaginationContext
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
    lastModifiedTimestamp: String
  }

  type Equipment {
    id: Int!
    equipmentType: String!
    inventoryId: String!
    customerId: Int!
    profileId: Int!
    locationId: Int!
    name: String!
    latitude: String
    longitude: String
    serial: String
    lastModifiedTimestamp: String
    details: JSONObject
  }

  type EquipmentPagination {
    items: [Equipment]
    context: PaginationContext
  }

  type Mutation {
    authenticateUser(email: String!, password: String!): Token
    updateToken(refreshToken: String!): Token

    createUser(username: String!, password: String!, role: String!, customerId: Int!): User
    updateUser(
      id: Int!
      username: String!
      password: String!
      role: String!
      customerId: Int!
      lastModifiedTimestamp: String
    ): User

    createLocation(locationType: String!, customerId: Int!, parentId: Int!, name: String!): Location
    updateLocation(
      id: Int!
      locationType: String!
      customerId: Int!
      parentId: Int!
      name: String!
      lastModifiedTimestamp: String
    ): Location

    createEquipment(
      equipmentType: String!
      inventoryId: String!
      customerId: Int!
      profileId: Int!
      locationId: Int!
      name: String!
      latitude: String
      longitude: String
      serial: String
      lastModifiedTimestamp: String
      details: JSONObject
    ): Equipment
    updateEquipment(
      id: Int!
      equipmentType: String!
      inventoryId: String!
      customerId: Int!
      profileId: Int!
      locationId: Int!
      name: String!
      latitude: String
      longitude: String
      serial: String
      lastModifiedTimestamp: String
      details: JSONObject
    ): Equipment
  }
`;

module.exports = typeDefs;
