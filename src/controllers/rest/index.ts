import express, { Router } from "express";

import { DAL } from "../../dal";
import { getProductsController } from "./products";

export const getControllers = (dal: DAL): Router => {
  const router = express.Router();

  router.use("/products", getProductsController(dal));

  return router;
};
