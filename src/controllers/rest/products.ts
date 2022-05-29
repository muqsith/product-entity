import express, { Request, Response, NextFunction, Router } from "express";

import { Product } from "../../entities/Product";
import { DAL } from "../../dal";

export const getProductsController = (dal: DAL): Router => {
  const router = express.Router();

  router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const products: Array<Product> = await dal.productAccess.getProducts();
    return res.status(200).send(products);
  });

  return router;
};
