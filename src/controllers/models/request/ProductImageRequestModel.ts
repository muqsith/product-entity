import Joi from "joi";

const productImageValidationSchema = Joi.object({
  url: Joi.string().uri(),
  productId: Joi.string().uuid().required(),
});

/**
 * @openapi
 * "components": {
 *    "schemas": {
 *        "ProductImageRequestModel": {
 *            "type": "object",
 *            "properties": {
 *                 "url": {
 *                    "type": "string",
 *                    "required": true
 *                 },
 *                  "main": {
 *                     "type": "boolean"
 *                  },
 *                  "productId": {
 *                      "type": "string",
 *                      "required": true
 *                  }
 *             }
 *        }
 *    }
 * }
 */
export class ProductImageRequestModel {
  id: string;
  productId: string;
  url: string;
  main: boolean;
  archived: boolean;

  constructor(data: any) {
    this.id = data.id;
    this.productId = data.productId;
    this.url = data.url;
    this.main = data.main;
    this.archived = data.archived;
  }

  validate() {
    productImageValidationSchema.validate(this);
  }
}
