import express from "express";
import swaggerUi from "swagger-ui-express";

import { swaggerDocument } from "./swaggerOptions";

export const getSwaggerController = () => {
  const app = express();
  app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  return app;
};
