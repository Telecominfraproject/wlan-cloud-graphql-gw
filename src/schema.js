const { gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  scalar JSONObject

  type Query {
    getUser(id: Int!): User
    getAllUsers(customerId: Int!, cursor: String, limit: Int): UserPagination

    getCustomer(id: Int!): Customer
    findCustomer: [Customer]

    getLocation(id: Int!): Location
    getAllLocations(customerId: Int!): [Location]

    getEquipment(id: Int!): Equipment
    getAllEquipment(customerId: Int!, cursor: String, limit: Int): EquipmentPagination
    filterEquipment(
      customerId: Int!
      locationIds: [Int]
      equipmentType: String
      cursor: String
      limit: Int
    ): EquipmentPagination

    getEquipmentStatus(
      customerId: Int!
      equipmentIds: [Int]
      statusDataTypes: [String]
    ): EquipmentStatus

    getAllStatus(
      customerId: Int!
      statusDataTypes: [String]
      cursor: String
      limit: Int
    ): StatusPagination

    getProfile(id: Int!): Profile
    getAllProfiles(customerId: Int!, cursor: String, limit: Int, type: String): ProfilePagination

    getClientSession(customerId: Int!, macAddress: String!): [ClientSession]
    filterClientSessions(
      customerId: Int!
      locationIds: [Int]
      cursor: String
      limit: Int
    ): ClientSessionPagination

    getAllAlarms(customerId: Int!, cursor: String, limit: Int): AlarmPagination

    filterServiceMetrics(
      customerId: Int!
      fromTime: Int!
      toTime: Int!
      clientMacs: [String]
      equipmentIds: [ID]
      dataTypes: [String]
      cursor: String
      limit: Int
    ): ServiceMetricPagination

    getOui(oui: String!): ManufacturerOuiDetails
    getAllOui: [JSONObject]

    getAllFirmware: [Firmware]
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
    details: JSONObject
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
    channel: [Int]
    model: String
    lastModifiedTimestamp: String
    profile: Profile
    alarmsCount: Int
    alarms: [Alarm]
    status: EquipmentStatus
    details: JSONObject
  }

  type EquipmentPagination {
    items: [Equipment]
    context: PaginationContext
  }

  input EquipmentRrmUpdate {
    equipmentId: ID
    perRadioDetails: JSONObject
  }

  type EquipmentStatus {
    protocol: Status
    radioUtilization: Status
    osPerformance: Status
    clientDetails: Status
    firmware: Status
    dashboard: Status
  }

  type Status {
    customerId: Int!
    statusDataType: String
    lastModifiedTimestamp: String
    details: StatusDetails
    detailsJSON: JSONObject
  }

  type StatusDetails {
    reportedIpV4Addr: String
    reportedMacAddr: String
    uptimeInSeconds: Int
    capacityDetails: [Int]
    noiseFloorDetails: [Int]
    numClientsPerRadio: [Int]
    manufacturer: String
    equipmentCountPerOui: JSONObject
    clientCountPerOui: JSONObject
  }

  type StatusPagination {
    items: [Status]
    context: PaginationContext
  }

  type Profile {
    id: Int!
    profileType: String!
    customerId: Int!
    name: String!
    childProfileIds: [Int]
    childProfiles: [Profile]
    createdTimestamp: String
    lastModifiedTimestamp: String
    details: JSONObject
  }

  type ProfilePagination {
    items: [Profile]
    context: PaginationContext
  }

  type ClientSession {
    id: ID
    customerId: Int!
    macAddress: String
    ipAddress: String
    hostname: String
    ssid: String
    radioType: String
    signal: String
    manufacturer: String
    lastModifiedTimestamp: String
    details: JSONObject
    equipment: Equipment
  }

  type ClientSessionPagination {
    items: [ClientSession]
    context: PaginationContext
  }

  type ServiceMetric {
    customerId: Int!
    equipmentId: Int!
    dataType: String
    createdTimestamp: String
    rssi: Int
    rxBytes: Int
    txBytes: Int
    freeMemory: Int
    cpuUtilized: [Int]
    cpuTemperature: Int
  }

  type ServiceMetricPagination {
    items: [ServiceMetric]
    context: PaginationContext
  }

  type Alarm {
    customerId: Int!
    alarmCode: String!
    severity: String!
    createdTimestamp: String
    lastModifiedTimestamp: String
    equipment: Equipment
    details: JSONObject
  }

  type AlarmPagination {
    items: [Alarm]
    context: PaginationContext
  }

  type Firmware {
    id: ID!
    modelId: String
    versionName: String
    description: String
    filename: String
    commit: String
    releaseDate: String
  }

  type ManufacturerOuiDetails {
    manufacturerAlias: String
    manufacturerName: String
    oui: String
  }

  type File {
    fileName: String
    baseUrl: String
  }

  type GenericResponse {
    message: String
    success: Boolean
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
    deleteUser(id: Int!): User

    createLocation(locationType: String!, customerId: Int!, parentId: Int!, name: String!): Location
    updateLocation(
      id: Int!
      locationType: String!
      customerId: Int!
      parentId: Int!
      name: String!
      details: JSONObject
      lastModifiedTimestamp: String
    ): Location
    deleteLocation(id: Int!): Location

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
    updateEquipmentBulk(items: [EquipmentRrmUpdate]): GenericResponse
    deleteEquipment(id: Int!): Equipment
    updateEquipmentFirmware(equipmentId: Int, firmwareVersionId: Int): GenericResponse

    createProfile(
      profileType: String!
      customerId: Int!
      name: String!
      childProfileIds: [Int]
      details: JSONObject
    ): Profile
    updateProfile(
      id: Int!
      profileType: String!
      customerId: Int!
      name: String!
      childProfileIds: [Int]
      createdTimestamp: String
      lastModifiedTimestamp: String
      details: JSONObject
    ): Profile
    deleteProfile(id: Int!): Profile

    updateOui(
      manufacturerAlias: String
      manufacturerName: String
      oui: String
    ): ManufacturerOuiDetails

    fileUpload(fileName: String, file: Upload): File
    ouiUpload(fileName: String, file: Upload): File
  }
`;

module.exports = typeDefs;
