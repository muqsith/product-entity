import { Category } from "../../../entities/Category";

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
