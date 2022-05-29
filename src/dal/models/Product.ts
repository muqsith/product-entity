import { normalizeInput } from "../../utils";

export class Product {
  id: string;
  name: string;
  price: number;
  description: string;
  categoryId: string;
  status: string;
  constructor(data: Record<string, any>) {
    const normalizedData = normalizeInput(data);
    this.id = normalizedData.id;
    this.name = normalizedData.name;
    this.price = normalizedData.price;
    this.description = normalizedData.description;
    this.categoryId = normalizedData.categoryid;
    this.status = normalizedData.status;
  }
}
