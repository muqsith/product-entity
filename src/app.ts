import express from "express";

import { getConfig } from "./config";
import { DAL } from "./dal";
import { getLogger } from "./logger";
import { getControllers } from "./controllers/rest";

export const getApp = () => {
  const config = getConfig();
  const logger = getLogger();

  const app = express();
  app.set("port", config.serverPort);

  const dal = new DAL(config, logger);

  app.use("/api/rest", getControllers(dal));

  return app;
};
