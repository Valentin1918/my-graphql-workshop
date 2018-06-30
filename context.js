const { ApolloServer, gql } = require("apollo-server");
const Sequelize = require("sequelize");
const axios = require("axios");

require("dotenv").config({ path: "../.env" });

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
  },
  stars: {
    type: Sequelize.INTEGER
  }
});
Framework.sync({ force: true });

const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.
  type Framework {
    id: String
    name: String
    git: String
    stars: Int
  }

  type Query {
    frameworks: [Framework]
  }

  type Mutation {
    addFramework(name: String, git: String): Framework
  }
`;

const resolvers = {
  Query: {
    frameworks: (_, __, ctx) => {
      console.log('ctx', ctx.db);
      return ctx.db.findAll();
    }
  },
  Mutation: {
    addFramework: async (_, { name, git }) => {
      const frameworkURL = git.split('https://github.com/');
      const url = `https://api.github.com/repos/${frameworkURL}`;
      const result = await axios(url);
      console.log('result', result);

      const fram = await Framework.create({
        name, git,
        // stars: ...
      })
    }
  }
};

const context = {
  db: 'MongoDB'
};

const server = new ApolloServer({ typeDefs, resolvers, context });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
