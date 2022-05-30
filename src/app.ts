import express from "express";

import { getConfig } from "./config";
import { DAL } from "./dal";
import { getLogger } from "./logger";
import { getControllers } from "./controllers/rest";

export const getApp = () => {
  const config = getConfig(process.env.NODE_ENV);
  const logger = getLogger();

  const app = express();
  app.set("port", config.serverPort);

  const dal = new DAL(config, logger);

  // set middlewares
  app.use(express.json());

  app.use("/api/rest", getControllers(dal));

  return app;
};
