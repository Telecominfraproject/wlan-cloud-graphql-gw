// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    findCustomer: async (_, {}, { dataSources }) => {
      return dataSources.api.findCustomer();
    },
  },
  Mutation: {
    authenticateUser: async (_, { email, password }, { dataSources }) => {
      return dataSources.api.createToken(email, password);
    },
    updateToken: async (_, { refreshToken }, { dataSources }) => {
      return dataSources.api.updateToken(refreshToken);
    },
  },
};

module.exports = resolvers;
