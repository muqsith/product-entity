import express, { Request, Response, NextFunction, Router } from "express";
import createHttpError from "http-errors";

import { Product } from "../../entities/Product";
import { DAL } from "../../dal";
import { ProductRequestModel } from "../models/request/ProductRequestModel";
import { ProductResponseModel } from "../models/response/ProductResponseModel";
import { ProductImageResponseModel } from "../models/response/ProductImageResponseModel";

export const getProductsController = (dal: DAL): Router => {
  const router = express.Router();

  const getProductResponseModel = async (products: Array<Product>) => {
    const productsResponse: Array<ProductResponseModel> = [];
    for (const product of products) {
      const productResponse = new ProductResponseModel(product);
      const productImages = await dal.productImageAccess.getProductImages(
        product.id
      );
      const productImagesResponse: Array<ProductImageResponseModel> =
        productImages.map(
          (productImage) => new ProductImageResponseModel(productImage)
        );
      productResponse.images = productImagesResponse;
    }
    return productsResponse;
  };

  router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const products: Array<Product> = await dal.productAccess.getProducts();
    const productsResponse = await getProductResponseModel(products);
    return res.status(200).send(productsResponse);
  });

  router.get(
    "/:status",
    async (req: Request, res: Response, next: NextFunction) => {
      const status = req.params.status;
      const products: Array<Product> =
        await dal.productAccess.getProductsByStatus(status);
      const productsResponse = await getProductResponseModel(products);
      return res.status(200).send(productsResponse);
    }
  );

  router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const productData = req?.body?.product;

    const productRequestModel = new ProductRequestModel(productData);
    try {
      productRequestModel.validateCreate();
    } catch (validationError) {
      return next(createHttpError(400, validationError));
    }

    const newProduct = productRequestModel.getNewProduct();
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
    const productData = req?.body?.product;
    const productRequestModel = new ProductRequestModel(productData);
    try {
      productRequestModel.validateUpdate();
    } catch (validationError) {
      return next(createHttpError(400, validationError));
    }

    const product = productRequestModel.getProduct();
    const toStatus = product.status;
    const savedProduct = await dal.productAccess.getProduct(product.id);
    const fromStatus = savedProduct.status;
    try {
      if (toStatus !== fromStatus) {
        // set product to current status
        product.status = fromStatus;
        // initiate status change
        product.setStatus(toStatus);
      }
    } catch (statusChangeError) {
      return next(createHttpError(400, statusChangeError));
    }

    // update product if status change is successful
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
