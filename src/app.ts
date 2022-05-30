import express from "express";

import { getConfig } from "./config";
import { DAL } from "./dal";
import { getLogger } from "./logger";
import { getControllers } from "./controllers/rest";
import { errorHandler } from "./errorHandler";

import { getSwaggerController } from "./controllers/api-docs/swaggerController";

export const getApp = () => {
  const config = getConfig(process.env.NODE_ENV);
  const logger = getLogger();

  const app = express();
  app.set("port", config.serverPort);

  const dal = new DAL(config, logger);

  // set middlewares
  app.use(express.json());

  app.use("/api/rest", getControllers(dal));

  app.use("/api/docs", getSwaggerController());

  app.use(errorHandler);

  return app;
};
