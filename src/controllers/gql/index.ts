import express from "express";
import { graphqlHTTP } from "express-graphql";

import { DAL } from "../../dal";
import { schema } from "./schema";

export const getGraphQLController = (dal: DAL) => {
  const app = express();
  app.use(
    "/",
    graphqlHTTP({
      context: dal,
      schema,
      graphiql: true,
    })
  );

  return app;
};
