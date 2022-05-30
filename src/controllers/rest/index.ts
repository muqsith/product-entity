import express, { Router } from "express";

import { DAL } from "../../dal";
import { getCategoriesController } from "./categories";
import { getProductsController } from "./products";

export const getControllers = (dal: DAL): Router => {
  const router = express.Router();

  router
    .use("/products", getProductsController(dal))
    .use("/categories", getCategoriesController(dal));

  return router;
};
