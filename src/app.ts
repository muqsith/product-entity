import express from "express";

import { getConfig } from "./config";
import { DAL } from "./dal";
import { getLogger } from "./logger";
import { getControllers } from "./controllers/rest";
import { errorHandler } from "./errorHandler";

import { getSwaggerController } from "./controllers/api-docs/swaggerController";
import { getGraphQLController } from "./controllers/gql";
import { loadSeedData } from "./seed";

export const getApp = async () => {
  const NODE_ENV = process.env.NODE_ENV;
  const config = getConfig(NODE_ENV);
  const logger = getLogger();

  const app = express();
  app.set("port", config.serverPort);

  const dal = new DAL(config, logger);
  if (NODE_ENV === "development") {
    // load seed data
    await loadSeedData(dal);
  }

  // set middlewares
  app.use(express.json());

  // rest api
  app.use("/api/rest", getControllers(dal));
  app.use("/api/docs", getSwaggerController());

  // graphql api
  app.use("/api/gql", getGraphQLController(dal));

  app.use(errorHandler);

  return app;
};
