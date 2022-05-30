import { ProductImage } from "../../../entities/ProductImage";

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
