import Joi from "joi";
import { DAL } from "../../../dal";
import { Category } from "../../../entities/Category";

const categoryValidationSchema = Joi.object({
  name: Joi.string().min(3).max(500).required(),
  parentId: Joi.string().uuid(),
});

/**
 * @openapi
 * "components": {
 *    "schemas": {
 *        "CategoryRequestModel": {
 *            "type": "object",
 *            "properties": {
 *                 "name": {
 *                    "type": "string",
 *                    "required": true
 *                 },
 *                  "parentId": {
 *                     "type": "string"
 *                  }
 *             }
 *        }
 *    }
 * }
 */
export class CategoryRequestModel {
  name: string;
  parentId: string;
  constructor(data: any) {
    this.name = data.name;
    this.parentId = data.parentId;
  }

  async validate(dal: DAL) {
    const validationResult = categoryValidationSchema.validate(this);
    if (validationResult.error) {
      const errorMessage = validationResult.error.message;
      throw new Error(errorMessage);
    }
    if (this.parentId) {
      const parentCategory = await dal.categoryAccess.getCategory(
        this.parentId
      );
      if (!parentCategory) {
        throw new Error(`Parent category with id ${this.parentId} not found`);
      }
    }
  }

  getCategory(): Category {
    return new Category(this);
  }
}
