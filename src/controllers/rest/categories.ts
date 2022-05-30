import express, { Request, Response, NextFunction, Router } from "express";
import createHttpError from "http-errors";
import { DAL } from "../../dal";
import { CategoryRequestModel } from "../models/request/CategoryRequestModel";
import { CategoryResponseModel } from "../models/response/CategoryResponseModel";

export const getCategoriesController = (dal: DAL): Router => {
  const router = express.Router();

  /**
   * @openapi
   * "/api/rest/categories": {
   *        "get": {
   *          "summary": "Returns a list of categories",
   *          "description": "End point to fetch list of categories",
   *          "tags": ["CATEGORY"],
   *          "parameters": [{
   *              "in": "query",
   *              "description": "Parent category ID",
   *              "name": "id",
   *              "schema": {
   *                "type": "string"
   *              }
   *          }],
   *          "responses": {
   *            "200": {
   *               "description": "Category response object",
   *               "content": {
   *                  "application/json": {
   *                     "schema": {
   *                         "type": "array",
   *                          "items": {
   *                              "$ref": "#/components/schemas/CategoryResponseModel"
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
    const parentCategoryId = req.query.id ? String(req.query.id) : undefined;
    const categories = parentCategoryId
      ? await dal.categoryAccess.getCategoriesByParentId(parentCategoryId)
      : await dal.categoryAccess.getCategories();
    // construct response
    const categoriesResponse: Array<CategoryResponseModel> = categories.map(
      (category) => new CategoryResponseModel(category)
    );
    return res.status(200).send(categoriesResponse);
  });

  /**
   * @openapi
   * "/api/rest/categories": {
   *        "post": {
   *          "summary": "Create a new category",
   *          "description": "End point to create a new category",
   *          "tags": ["CATEGORY"],
   *          "requestBody": {
   *             "description": "Create category request body",
   *             "required": true,
   *             "content": {
   *                "application/json": {
   *                    "schema": {
   *                      "$ref": "#/components/schemas/CategoryRequestModel"
   *                    }
   *                 }
   *              }
   *          },
   *          "responses": {
   *            "200": {
   *               "description": "Category response object",
   *               "content": {
   *                  "application/json": {
   *                     "schema": {
   *                         "$ref": "#/components/schemas/CategoryResponseModel"
   *                      }
   *                   }
   *                }
   *            }
   *          }
   *        }
   *      }
   */
  router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const categoryData = req?.body;

    const categoryRequestModel = new CategoryRequestModel(categoryData);
    try {
      await categoryRequestModel.validate(dal);
    } catch (validationError) {
      return next(createHttpError(400, validationError));
    }

    const newCategory = categoryRequestModel.getCategory();
    const savedCategory = await dal.categoryAccess.addCategory(newCategory);
    const categoryResponse = new CategoryResponseModel(savedCategory);

    return res.status(200).send(categoryResponse);
  });

  return router;
};
