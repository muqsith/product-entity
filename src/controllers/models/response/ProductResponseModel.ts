import { Product } from "../../../entities/Product";
import { ProductImageResponseModel } from "./ProductImageResponseModel";

export class ProductResponseModel {
  id: string;
  name: string;
  price: number;
  description: string;
  categoryId: string;
  status: string;
  images: Array<ProductImageResponseModel>;

  constructor(data: Product) {
    this.id = data.id;
    this.name = data.name;
    this.price = data.price;
    this.description = data.description;
    this.categoryId = data.categoryId;
    this.status = data.status;
    this.images = [];
  }
}
