import express, { Request, Response, NextFunction, Router } from "express";
import createHttpError from "http-errors";

import { Product } from "../../entities/Product";
import { DAL } from "../../dal";
import { ProductRequestModel } from "../models/request/ProductRequestModel";
import { ProductResponseModel } from "../models/response/ProductResponseModel";
import { ProductImageResponseModel } from "../models/response/ProductImageResponseModel";

export const getProductsController = (dal: DAL): Router => {
  const router = express.Router();

  router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const status = req.query.status ? String(req.query.status) : undefined;
    const products: Array<Product> = status
      ? await dal.productAccess.getProductsByStatus(status)
      : await dal.productAccess.getProducts();

    // construct response
    const productsResponse: Array<ProductResponseModel> = [];
    for (const product of products) {
      const productResponse = new ProductResponseModel(product);
      // fetch images
      const productImages = await dal.productImageAccess.getProductImages(
        product.id
      );
      const productImagesResponse: Array<ProductImageResponseModel> =
        productImages.map(
          (productImage) => new ProductImageResponseModel(productImage)
        );
      productResponse.images = productImagesResponse;
      productsResponse.push(productResponse);
    }
    return res.status(200).send(productsResponse);
  });

  router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const productData = req.body;

    const productRequestModel = new ProductRequestModel(productData);
    try {
      productRequestModel.validateCreate();
    } catch (validationError: any) {
      return next(createHttpError(400, validationError.message));
    }

    const newProduct = productRequestModel.getNewProduct();

    // create product
    const savedProduct = await dal.productAccess.addProduct(newProduct);

    // handle images
    const newProductImages = productRequestModel.getProductImages();
    newProductImages.forEach(
      (newProductImage) => (newProductImage.productId = savedProduct.id)
    );
    const savedProductImages = await dal.productImageAccess.addProductImages(
      newProductImages
    );

    // construct response
    const productResponseModel = new ProductResponseModel(savedProduct);
    productResponseModel.images = savedProductImages.map(
      (savedProductImage) => new ProductImageResponseModel(savedProductImage)
    );

    return res.status(200).send(productResponseModel);
  });

  router.put("/", async (req: Request, res: Response, next: NextFunction) => {
    const productData = req.body;
    const productRequestModel = new ProductRequestModel(productData);
    try {
      await productRequestModel.validateUpdate(dal);
    } catch (validationError: any) {
      return next(createHttpError(400, validationError.message));
    }

    const product = productRequestModel.getProduct();

    // update product
    const updatedProduct = await dal.productAccess.updateProduct(product);

    // handle images
    const productImages = productRequestModel.getProductImages();
    productImages.forEach(
      (productImage) => (productImage.productId = updatedProduct.id)
    );
    const savedProductImages = await dal.productImageAccess.addProductImages(
      productImages
    );

    // construct response
    const productResponseModel = new ProductResponseModel(updatedProduct);
    productResponseModel.images = savedProductImages.map(
      (savedProductImage) => new ProductImageResponseModel(savedProductImage)
    );

    return res.status(200).send(productResponseModel);
  });

  return router;
};
