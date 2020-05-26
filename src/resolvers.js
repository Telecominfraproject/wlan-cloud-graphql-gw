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
    getAllUsers: async (_, { customerId }, { dataSources }) => {
      return dataSources.api.getAllUsers(customerId);
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
    getAllEquipment: async (_, { customerId }, { dataSources }) => {
      return dataSources.api.getAllEquipment(customerId);
    },
    filterEquipment: async (_, { customerId, locationIds, equipmentType }, { dataSources }) => {
      return dataSources.api.filterEquipment(customerId, locationIds, equipmentType);
    },

    getProfile: async (_, { id }, { dataSources }) => {
      return dataSources.api.getProfile(id);
    },
    deleteProfile: async (_, { id }, { dataSources }) => {
      return dataSources.api.deleteProfile(id);
    },
    getAllProfiles: async (_, { customerId }, { dataSources }) => {
      return dataSources.api.getAllProfiles(customerId);
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
      { profileType, customerId, name, childProfileIds, detailss },
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
};

module.exports = resolvers;
