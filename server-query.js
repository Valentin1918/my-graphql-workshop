require("dotenv").config({ path: "../.env" });
const { ApolloServer, gql } = require("apollo-server");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${
    process.env.DB_HOST
  }:5432/${process.env.DB}`,
  {
    ssl: true,
    dialectOptions: {
      ssl: true
    }
  }
);

const Framework = sequelize.define("frameworks", {
  name: {
    type: Sequelize.STRING
  },
  git: {
    type: Sequelize.STRING
  }
});

// fragment frameworkFragment on Framework {
//   id, name, git
// } // can use in queries

const typeDefs = gql`  
  
  type Frameworks {
      id: ID!
      name: String
      git: String
  }
  
  type Query {
      framewors: [Framework]
  }
  
  input frameworkInput {
      name: String
      git: String
  }
  
  type Mutation {
      addFramework(params: frameworkInput): Framework
  }
  
`;

const resolvers = {
  Query: {
    frameworks: () => Framework.findAll()
  },
  Mutation: {
    addFramework: async (_, { name, git }) => {
      const createdFramework = await Framework.create({
        name,
        git
      });
      return createdFramework
  }
}

};
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
