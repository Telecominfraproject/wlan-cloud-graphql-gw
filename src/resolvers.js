// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
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
  },
  Mutation: {
    authenticateUser: async (_, { email, password }, { dataSources }) => {
      return dataSources.api.createToken(email, password);
    },
    updateToken: async (_, { refreshToken }, { dataSources }) => {
      return dataSources.api.updateToken(refreshToken);
    },

    createUser: async (_, { id, username, password, role, customerId }, { dataSources }) => {
      return dataSources.api.createUser({ id, username, password, role, customerId });
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

    createLocation: async (
      _,
      { id, locationType, customerId, parentId, name },
      { dataSources }
    ) => {
      return dataSources.api.createLocation({ id, locationType, customerId, parentId, name });
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
  },
};

module.exports = resolvers;
