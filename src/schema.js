const { gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  scalar JSONObject

  type Query {
    getApiUrl: String

    getUser(id: ID!): User
    getAllUsers(customerId: ID!, cursor: String, limit: Int, context: JSONObject): UserPagination

    getCustomer(id: ID!): Customer
    findCustomer: [Customer]

    getLocation(id: ID!): Location
    getAllLocations(customerId: ID!): [Location]

    getEquipment(id: ID!): Equipment
    getAllEquipment(
      customerId: ID!
      cursor: String
      limit: Int
      context: JSONObject
    ): EquipmentPagination
    filterEquipment(
      customerId: ID!
      locationIds: [ID]
      equipmentType: String
      cursor: String
      limit: Int
      context: JSONObject
    ): EquipmentPagination

    getEquipmentStatus(
      customerId: ID!
      equipmentIds: [ID]
      statusDataTypes: [String]
    ): EquipmentStatus

    getAllStatus(
      customerId: ID!
      statusDataTypes: [String]
      cursor: String
      limit: Int
      context: JSONObject
    ): StatusPagination

    getProfile(id: ID!): Profile
    getAllProfiles(
      customerId: ID!
      cursor: String
      limit: Int
      type: String
      context: JSONObject
    ): ProfilePagination

    getClientSession(customerId: ID!, macAddress: String!): [ClientSession]
    filterClientSessions(
      customerId: ID!
      locationIds: [ID]
      cursor: String
      limit: Int
      context: JSONObject
    ): ClientSessionPagination
    getClients(customerId: ID!, macAddress: [String]): [Client]
    getBlockedClients(customerId: ID!): [Client]

    getAlarmCount(customerId: ID!): Int
    getAllAlarms(customerId: ID!, cursor: String, limit: Int, context: JSONObject): AlarmPagination

    filterServiceMetrics(
      customerId: ID!
      fromTime: String!
      toTime: String!
      clientMacs: [String]
      equipmentIds: [ID]
      dataTypes: [String]
      cursor: String
      limit: Int
      context: JSONObject
    ): ServiceMetricPagination

    filterSystemEvents(
      customerId: ID!
      fromTime: String!
      toTime: String!
      equipmentIds: [ID]
      dataTypes: [String]
      cursor: String
      limit: Int
      context: JSONObject
    ): SystemEventPagination

    getOui(oui: String!): ManufacturerOuiDetails
    getAllOui: [JSONObject]

    getAllFirmware(modelId: String): [Firmware]
    getAllFirmwareModelId: [String]
    getAllFirmwareTrackAssignment: [FirmwareTrackAssignment]
    getFirmwareTrack(firmwareTrackName: String!): FirmwareTrack
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
    id: ID!
    username: String!
    password: String
    role: String!
    customerId: ID!
    lastModifiedTimestamp: String
  }

  type UserPagination {
    items: [User]
    context: JSONObject
  }

  type Customer {
    id: ID!
    name: String!
    email: String
    details: JSONObject
    createdTimestamp: String
    lastModifiedTimestamp: String
  }

  type Token {
    access_token: String!
    refresh_token: String!
    expires_in: String!
  }

  type Location {
    id: ID!
    locationType: String!
    customerId: ID!
    parentId: ID!
    name: String!
    details: JSONObject
    lastModifiedTimestamp: String
  }

  type Equipment {
    id: ID!
    equipmentType: String!
    inventoryId: String!
    customerId: ID!
    profileId: ID!
    locationId: ID!
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
    context: JSONObject
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
    customerId: ID!
    statusDataType: String
    lastModifiedTimestamp: String
    details: StatusDetails
    detailsJSON: JSONObject
    alarmsCount: JSONObject
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
    context: JSONObject
  }

  type Profile {
    id: ID!
    profileType: String!
    customerId: ID!
    name: String!
    childProfileIds: [ID]
    childProfiles: [Profile]
    createdTimestamp: String
    lastModifiedTimestamp: String
    equipmentCount: Int
    details: JSONObject
  }

  type ProfilePagination {
    items: [Profile]
    context: JSONObject
  }

  type ClientSession {
    id: ID
    customerId: ID!
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
    context: JSONObject
  }

  type Client {
    customerId: ID!
    macAddress: String
    createdTimestamp: String
    lastModifiedTimestamp: String
    details: JSONObject
  }

  type ServiceMetric {
    customerId: ID!
    equipmentId: ID!
    dataType: String
    createdTimestamp: String
    rssi: Int
    rxBytes: Int
    txBytes: Int
    freeMemory: Int
    cpuUtilized: [Int]
    cpuTemperature: Int
    detailsJSON: JSONObject
  }

  type ServiceMetricPagination {
    items: [ServiceMetric]
    context: JSONObject
  }

  type SystemEventPagination {
    items: [JSONObject]
    context: JSONObject
  }

  type Alarm {
    customerId: ID!
    alarmCode: String!
    severity: String!
    createdTimestamp: String
    lastModifiedTimestamp: String
    equipment: Equipment
    details: JSONObject
  }

  type AlarmPagination {
    items: [Alarm]
    context: JSONObject
  }

  type Firmware {
    id: ID!
    modelId: String!
    versionName: String
    description: String
    filename: String
    commit: String
    releaseDate: String
    validationCode: String
    createdTimestamp: String
    lastModifiedTimestamp: String
  }

  type FirmwareTrackAssignment {
    trackRecordId: ID!
    firmwareVersionRecordId: ID!
    modelId: String!
    createdTimestamp: String
    lastModifiedTimestamp: String
  }

  type FirmwareTrack {
    recordId: ID!
    trackName: String
    createdTimestamp: String
    lastModifiedTimestamp: String
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

    createUser(username: String!, password: String!, role: String!, customerId: ID!): User
    updateUser(
      id: ID!
      username: String!
      password: String!
      role: String!
      customerId: ID!
      lastModifiedTimestamp: String
    ): User
    deleteUser(id: ID!): User

    updateCustomer(
      id: ID!
      email: String!
      name: String!
      details: JSONObject
      createdTimestamp: String
      lastModifiedTimestamp: String
    ): Customer

    createLocation(locationType: String!, customerId: ID!, parentId: ID!, name: String!): Location
    updateLocation(
      id: ID!
      locationType: String!
      customerId: ID!
      parentId: ID!
      name: String!
      details: JSONObject
      lastModifiedTimestamp: String
    ): Location
    deleteLocation(id: ID!): Location

    createEquipment(
      inventoryId: String!
      customerId: ID!
      profileId: ID!
      locationId: ID!
      name: String!
    ): Equipment
    updateEquipment(
      id: ID!
      equipmentType: String!
      inventoryId: String!
      customerId: ID!
      profileId: ID!
      locationId: ID!
      name: String!
      latitude: String
      longitude: String
      serial: String
      lastModifiedTimestamp: String
      details: JSONObject
    ): Equipment
    updateEquipmentBulk(items: [EquipmentRrmUpdate]): GenericResponse
    deleteEquipment(id: ID!): Equipment
    updateEquipmentFirmware(equipmentId: ID, firmwareVersionId: ID): GenericResponse
    requestEquipmentSwitchBank(equipmentId: ID): GenericResponse
    requestEquipmentReboot(equipmentId: ID): GenericResponse
    requestEquipmentFactoryReset(equipmentId: ID): GenericResponse

    createProfile(
      profileType: String!
      customerId: ID!
      name: String!
      childProfileIds: [ID]
      details: JSONObject
    ): Profile
    updateProfile(
      id: ID!
      profileType: String!
      customerId: ID!
      name: String!
      childProfileIds: [ID]
      createdTimestamp: String
      lastModifiedTimestamp: String
      details: JSONObject
    ): Profile
    deleteProfile(id: ID!): Profile

    updateOui(
      manufacturerAlias: String
      manufacturerName: String
      oui: String
    ): ManufacturerOuiDetails

    fileUpload(fileName: String, file: Upload): File
    ouiUpload(fileName: String, file: Upload): GenericResponse

    createFirmware(
      modelId: String!
      versionName: String
      description: String
      filename: String
      commit: String
      releaseDate: String
      validationCode: String
    ): Firmware
    updateFirmware(
      id: ID!
      modelId: String!
      versionName: String
      description: String
      filename: String
      commit: String
      releaseDate: String
      validationCode: String
      createdTimestamp: String
      lastModifiedTimestamp: String
    ): Firmware
    deleteFirmware(id: ID!): Firmware

    updateFirmwareTrackAssignment(
      trackRecordId: ID!
      firmwareVersionRecordId: ID!
      modelId: String!
      createdTimestamp: String
      lastModifiedTimestamp: String
    ): FirmwareTrackAssignment
    deleteFirmwareTrackAssignment(
      firmwareTrackId: ID!
      firmwareVersionId: ID!
    ): FirmwareTrackAssignment

    addBlockedClient(customerId: ID!, macAddress: String): Client
    updateClient(
      customerId: ID!
      macAddress: String
      details: JSONObject
      createdTimestamp: String
      lastModifiedTimestamp: String
    ): Client
  }
`;

module.exports = typeDefs;
