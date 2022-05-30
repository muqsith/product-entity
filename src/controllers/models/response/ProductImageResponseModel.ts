import { ProductImage } from "../../../entities/ProductImage";

/**
 * @openapi
 * "components": {
 *    "schemas": {
 *        "ProductImageResponseModel": {
 *            "type": "object",
 *            "properties": {
 *                "id": {
 *                    "type": "string"
 *                 },
 *                 "url": {
 *                    "type": "string"
 *                 },
 *                  "main": {
 *                     "type": "boolean"
 *                  },
 *                  "productId": {
 *                      "type": "string"
 *                  },
 *                  "archived": {
 *                      "type": "boolean"
 *                  }
 *             }
 *        }
 *    }
 * }
 */
export class ProductImageResponseModel {
  id: string;
  productId: string;
  url: string;
  main: boolean;
  archived: boolean;

  constructor(data: ProductImage) {
    this.id = data.id;
    this.productId = data.productId;
    this.url = data.url;
    this.main = data.main;
    this.archived = data.archived;
  }
}
