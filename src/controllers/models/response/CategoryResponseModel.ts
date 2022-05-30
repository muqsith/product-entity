import { Category } from "../../../entities/Category";

/**
 * @openapi
 * "components": {
 *    "schemas": {
 *        "CategoryResponseModel": {
 *            "type": "object",
 *            "properties": {
 *                 "id": {
 *                    "type": "string"
 *                 },
 *                 "name": {
 *                    "type": "string"
 *                 },
 *                  "parentId": {
 *                     "type": "string"
 *                  },
 *                  "status": {
 *                     "type": "string"
 *                  }
 *             }
 *        }
 *    }
 * }
 */
export class CategoryResponseModel {
  id: string;
  parentId: string;
  name: string;
  status: string;
  constructor(category: Category) {
    this.id = category.id;
    this.parentId = category.parentId;
    this.name = category.name;
    this.status = category.status;
  }
}
