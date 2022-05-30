import express, { Request, Response, NextFunction, Router } from "express";
import createHttpError from "http-errors";

import { Product } from "../../entities/Product";
import { DAL } from "../../dal";
import { ProductRequestModel } from "../models/request/ProductRequestModel";
import { ProductResponseModel } from "../models/response/ProductResponseModel";
import { ProductImageResponseModel } from "../models/response/ProductImageResponseModel";

export const getProductsController = (dal: DAL): Router => {
  const router = express.Router();

  /**
   * @openapi
   * "/api/rest/products": {
   *        "get": {
   *          "summary": "Returns a list of products",
   *          "description": "End point to fetch list of products",
   *          "tags": ["PRODUCT"],
   *          "parameters": [{
   *              "in": "query",
   *              "description": "Product status",
   *              "name": "status",
   *              "schema": {
   *                "type": "string",
   *                "default": "DRAFT",
   *                "enum": ["DRAFT", "AVAILABLE", "EXPIRED", "DELETED", "DRAFT_DELETED", "RESERVED", "SOLD", "RETURNED"]
   *              }
   *          }],
   *          "responses": {
   *            "200": {
   *               "description": "Product response object",
   *               "content": {
   *                  "application/json": {
   *                     "schema": {
   *                         "type": "array",
   *                          "items": {
   *                              "$ref": "#/components/schemas/ProductResponseModel"
   *                          }
   *                      }
   *                   }
   *                }
   *            }
   *          }
   *        }
   *      }
   */
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

  /**
   * @openapi
   * "/api/rest/products": {
   *        "post": {
   *          "summary": "Create a new product",
   *          "description": "End point to create a new product",
   *          "tags": ["PRODUCT"],
   *          "requestBody": {
   *             "description": "Create product request body",
   *             "required": true,
   *             "content": {
   *                "application/json": {
   *                    "schema": {
   *                      "$ref": "#/components/schemas/ProductRequestModel"
   *                    }
   *                 }
   *              }
   *          },
   *          "responses": {
   *            "200": {
   *               "description": "Product response object",
   *               "content": {
   *                  "application/json": {
   *                     "schema": {
   *                         "$ref": "#/components/schemas/ProductResponseModel"
   *                      }
   *                   }
   *                }
   *            }
   *          }
   *        }
   *      }
   */
  router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const productData = req.body;

    const productRequestModel = new ProductRequestModel(productData);
    try {
      await productRequestModel.validateCreate(dal);
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

  /**
   * @openapi
   * "/api/rest/products": {
   *        "put": {
   *          "summary": "Update an existing product",
   *          "description": "End point to update and existing product",
   *          "tags": ["PRODUCT"],
   *          "requestBody": {
   *             "description": "Update product request body",
   *             "required": true,
   *             "content": {
   *                "application/json": {
   *                    "schema": {
   *                      "$ref": "#/components/schemas/ProductRequestModel"
   *                    }
   *                 }
   *              }
   *          },
   *          "responses": {
   *            "200": {
   *               "description": "Product response object",
   *               "content": {
   *                  "application/json": {
   *                     "schema": {
   *                         "$ref": "#/components/schemas/ProductResponseModel"
   *                      }
   *                   }
   *                }
   *            }
   *          }
   *        }
   *      }
   */
  router.put("/", async (req: Request, res: Response, next: NextFunction) => {
    const productData = req.body;
    const productRequestModel = new ProductRequestModel(productData);
    try {
      await productRequestModel.validateUpdate(dal);
    } catch (validationError: any) {
      return next(createHttpError(400, validationError.message));
    }

    const newProduct = productRequestModel.getProduct();

    const existingProduct = await dal.productAccess.getProduct(newProduct.id);
    if (newProduct.name) {
      existingProduct.name = newProduct.name;
    }
    if (newProduct.categoryId) {
      existingProduct.categoryId = newProduct.categoryId;
    }
    if (newProduct.status) {
      try {
        existingProduct.transformStatus(newProduct.status);
      } catch (productTransitionError: any) {
        return next(createHttpError(400, productTransitionError.message));
      }
    }
    if (!isNaN(newProduct.price) && newProduct.price !== null) {
      existingProduct.price = newProduct.price;
    }
    if (newProduct.description) {
      existingProduct.description = newProduct.description;
    }

    // update product
    const updatedProduct = await dal.productAccess.updateProduct(
      existingProduct
    );

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
