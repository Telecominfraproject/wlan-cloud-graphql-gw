// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    getCustomer: async (_, { customerId }, { dataSources }) => {
      return dataSources.api.getCustomer(customerId);
    },
    findCustomer: async (_, {}, { dataSources }) => {
      return dataSources.api.findCustomer();
    },

    getLocation: async (_, { locationId }, { dataSources }) => {
      return dataSources.api.getLocation(locationId);
    },
    deleteLocation: async (_, { locationId }, { dataSources }) => {
      return dataSources.api.deleteLocation(locationId);
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

    createLocation: async (
      _,
      { id, locationType, customerId, parentId, name },
      { dataSources }
    ) => {
      return dataSources.api.createLocation({ id, locationType, customerId, parentId, name });
    },
    updateLocation: async (
      _,
      { id, locationType, customerId, parentId, name },
      { dataSources }
    ) => {
      return dataSources.api.updateLocation({ id, locationType, customerId, parentId, name });
    },
  },
};

module.exports = resolvers;
