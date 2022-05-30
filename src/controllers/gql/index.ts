import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

export const getGraphQLController = () => {
  const schema = buildSchema(`
        type Query {
            hello: String
        }
    `);

  const root = {
    hello: () => "Hello World!",
  };

  const app = express();
  app.use(
    "/",
    graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true,
    })
  );

  return app;
};
