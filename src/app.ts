import express, { Request, Response, NextFunction } from "express";

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

  app.use((err, req: Request, res: Response, next: NextFunction) => {
    if (err?.statusCode) {
      return res.status(err.statusCode).send(err.message);
    }
    return res.status(500).send(err);
  });

  return app;
};
