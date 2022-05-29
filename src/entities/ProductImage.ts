import { normalizeInput } from "../utils";

export class ProductImage {
  id: string;
  productId: string;
  url: string;
  main: boolean;
  archived: boolean;
  constructor(data: Record<string, any>) {
    const normalizedData = normalizeInput(data);
    this.id = normalizedData.id;
    this.productId = normalizedData.productid;
    this.url = normalizedData.url;
    this.main = normalizedData.main;
    this.archived = normalizedData.archived;
  }
}
