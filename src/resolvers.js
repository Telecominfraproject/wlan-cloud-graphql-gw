// Resolvers define the technique for fetching the types defined in the schema.
import { GraphQLJSONObject } from 'graphql-type-json';

const resolvers = {
  JSONObject: GraphQLJSONObject,
  Query: {
    getUser: async (_, { id }, { dataSources }) => {
      return dataSources.api.getUser(id);
    },
    deleteUser: async (_, { id }, { dataSources }) => {
      return dataSources.api.deleteUser(id);
    },
    getAllUsers: async (_, { customerId, cursor, limit }, { dataSources }) => {
      return dataSources.api.getAllUsers(customerId, cursor, limit);
    },

    getCustomer: async (_, { id }, { dataSources }) => {
      return dataSources.api.getCustomer(id);
    },
    findCustomer: async (_, {}, { dataSources }) => {
      return dataSources.api.findCustomer();
    },

    getLocation: async (_, { id }, { dataSources }) => {
      return dataSources.api.getLocation(id);
    },
    deleteLocation: async (_, { id }, { dataSources }) => {
      return dataSources.api.deleteLocation(id);
    },
    getAllLocations: async (_, { customerId }, { dataSources }) => {
      return dataSources.api.getAllLocations(customerId);
    },

    getEquipment: async (_, { id }, { dataSources }) => {
      return dataSources.api.getEquipment(id);
    },
    deleteEquipment: async (_, { id }, { dataSources }) => {
      return dataSources.api.deleteEquipment(id);
    },
    getAllEquipment: async (_, { customerId, cursor, limit }, { dataSources }) => {
      return dataSources.api.getAllEquipment(customerId, cursor, limit);
    },
    filterEquipment: async (
      _,
      { customerId, locationIds, equipmentType, cursor, limit },
      { dataSources }
    ) => {
      return dataSources.api.filterEquipment(customerId, locationIds, equipmentType, cursor, limit);
    },

    getEquipmentStatus: async (
      _,
      { customerId, equipmentIds, statusDataTypes },
      { dataSources }
    ) => {
      return dataSources.api.getEquipmentStatus(customerId, equipmentIds, statusDataTypes);
    },

    getProfile: async (_, { id }, { dataSources }) => {
      return dataSources.api.getProfile(id);
    },
    deleteProfile: async (_, { id }, { dataSources }) => {
      return dataSources.api.deleteProfile(id);
    },
    getAllProfiles: async (_, { customerId, cursor, limit }, { dataSources }) => {
      return dataSources.api.getAllProfiles(customerId, cursor, limit);
    },

    getAllAlarms: async (_, { customerId, cursor, limit }, { dataSources }) => {
      return dataSources.api.getAllAlarms(customerId);
    },
  },
  Mutation: {
    authenticateUser: async (_, { email, password }, { dataSources }) => {
      return dataSources.api.createToken(email, password);
    },
    updateToken: async (_, { refreshToken }, { dataSources }) => {
      return dataSources.api.updateToken(refreshToken);
    },

    createUser: async (_, { username, password, role, customerId }, { dataSources }) => {
      return dataSources.api.createUser({ username, password, role, customerId });
    },
    updateUser: async (
      _,
      { id, username, password, role, customerId, lastModifiedTimestamp },
      { dataSources }
    ) => {
      return dataSources.api.updateUser({
        id,
        username,
        password,
        role,
        customerId,
        lastModifiedTimestamp,
      });
    },

    createLocation: async (_, { locationType, customerId, parentId, name }, { dataSources }) => {
      return dataSources.api.createLocation({ locationType, customerId, parentId, name });
    },
    updateLocation: async (
      _,
      { id, locationType, customerId, parentId, name, lastModifiedTimestamp },
      { dataSources }
    ) => {
      return dataSources.api.updateLocation({
        id,
        locationType,
        customerId,
        parentId,
        name,
        lastModifiedTimestamp,
      });
    },

    createEquipment: async (
      _,
      {
        equipmentType,
        inventoryId,
        customerId,
        profileId,
        locationId,
        name,
        latitude,
        longitude,
        serial,
        details,
      },
      { dataSources }
    ) => {
      return dataSources.api.createEquipment({
        equipmentType,
        inventoryId,
        customerId,
        profileId,
        locationId,
        name,
        latitude,
        longitude,
        serial,
        details,
      });
    },
    updateEquipment: async (
      _,
      {
        id,
        equipmentType,
        inventoryId,
        customerId,
        profileId,
        locationId,
        name,
        latitude,
        longitude,
        serial,
        lastModifiedTimestamp,
        details,
      },
      { dataSources }
    ) => {
      return dataSources.api.updateEquipment({
        id,
        equipmentType,
        inventoryId,
        customerId,
        profileId,
        locationId,
        name,
        latitude,
        longitude,
        serial,
        lastModifiedTimestamp,
        details,
      });
    },

    createProfile: async (
      _,
      { profileType, customerId, name, childProfileIds, details },
      { dataSources }
    ) => {
      return dataSources.api.createProfile({
        profileType,
        customerId,
        name,
        childProfileIds,
        details,
      });
    },
    updateProfile: async (
      _,
      { id, profileType, customerId, name, childProfileIds, lastModifiedTimestamp, details },
      { dataSources }
    ) => {
      return dataSources.api.updateProfile({
        id,
        profileType,
        customerId,
        name,
        childProfileIds,
        lastModifiedTimestamp,
        details,
      });
    },
  },
  Equipment: {
    profile: ({ profileId }, args, { dataSources }) => {
      return dataSources.api.getProfile(profileId);
    },
    status: ({ customerId, id }, args, { dataSources }) => {
      return dataSources.api.getEquipmentStatus(
        customerId,
        [id],
        ['PROTOCOL', 'OS_PERFORMANCE', 'RADIO_UTILIZATION', 'CLIENT_DETAILS']
      );
    },
    channel: ({ details }) => {
      const values = [];
      Object.keys(details.radioMap).forEach((i) => values.push(details.radioMap[i].channelNumber));
      return values;
    },
  },
  StatusPagination: {
    protocol: ({ items }) => items.find((i) => i.statusDataType === 'PROTOCOL'),
    osPerformance: ({ items }) => items.find((i) => i.statusDataType === 'OS_PERFORMANCE'),
    radioUtilization: ({ items }) => items.find((i) => i.statusDataType === 'RADIO_UTILIZATION'),
    clientDetails: ({ items }) => items.find((i) => i.statusDataType === 'CLIENT_DETAILS'),
  },
  StatusDetails: {
    reportedMacAddr: ({ reportedMacAddr }) => reportedMacAddr && reportedMacAddr.addressAsString,
    capacityDetails: ({ capacityDetails }) => {
      const values = [];
      Object.keys(capacityDetails).forEach((i) => values.push(capacityDetails[i].usedCapacity));
      return values;
    },
    noiseFloorDetails: ({ avgNoiseFloor }) => {
      const values = [];
      Object.keys(avgNoiseFloor).forEach((i) => values.push(avgNoiseFloor[i]));
      return values;
    },
  },
};

module.exports = resolvers;
