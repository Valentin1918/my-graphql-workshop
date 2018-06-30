const { ApolloServer, gql } = require("apollo-server");

const frameworks = [
  {
    title: "React",
    git: "https://github.com/facebook/react/",
    stars: 104170,
    developers: [{ name: 'Dan Obramov' }],
  },
  {
    title: "Vue",
    git: "https://github.com/vuejs/vue/",
    stars: 104483
  }
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
    # Comments in GraphQL are defined with the hash (#) symbol.

    # This "Framework" type can be used in other type declarations.
    type Framework {
        title: String
        git: String
        stars: Int,
        developers: [Developer]
    }

    type Developer {
        name: String
    }

    # The "Query" type is the root of all GraphQL queries.
    # (A "Mutation" type will be covered later on.)
    type Query {
        frameworks: [Framework]
        framework(title: String): Framework
    }
`;

const resolvers = {
  Query: {
    frameworks: () => frameworks,
    framework: (_, params) => frameworks.find(fr => fr.title === params.title)
  },
  Framework: {
    developers: ({ title, developers }) => developers || [{ name: 'Her Zna Hto' }]
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`🚀  Server ready at ${url}`));