import Joi from "joi";
import { STATUSES } from "../../../constants/Product";
import { Product } from "../../../entities/Product";
import { ProductImage } from "../../../entities/ProductImage";
import { ProductImageRequestModel } from "./ProductImageRequestModel";

const baseValidationSchema = {
  name: Joi.string().alphanum().min(3).max(300).required(),
  price: Joi.number().min(0).max(100000).required(),
  categoryId: Joi.string()
    .guid({
      version: ["uuidv4"],
    })
    .required(),
};
const productCreateValidationSchema = Joi.object(baseValidationSchema);
const productUpdateValidationSchema = Joi.object({
  ...baseValidationSchema,
  id: Joi.string()
    .guid({
      version: ["uuidv4"],
    })
    .required(),
});

export class ProductRequestModel {
  id: string;
  name: string;
  price: number;
  description: string;
  categoryId: string;
  status: string;
  images: Array<ProductImageRequestModel>;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.price = data.price;
    this.description = data.description;
    this.categoryId = data.categoryId;
    this.status = data.status;
    this.images = [];
    if (Array.isArray(data.images)) {
      this.images = data.images.map(
        (imageData) => new ProductImageRequestModel(imageData)
      );
    }
  }

  validateCreate() {
    productCreateValidationSchema.validate(this);
    if (this.images.length > 0) {
      this.images.forEach((image) => image.validate());
      const hasOneMainImage = this.images.some((image) => Boolean(image.main));
      if (!hasOneMainImage) {
        throw new Error("At least one image must be main");
      }
    }
  }

  validateUpdate() {
    productUpdateValidationSchema.validate(this);
    if (this.images.length > 0) {
      this.images.forEach((image) => image.validate());
      const hasOneMainImage = this.images.some((image) => Boolean(image.main));
      if (!hasOneMainImage) {
        throw new Error("At least one image must be main");
      }
    }
  }

  getProduct(): Product {
    return new Product(this);
  }

  getNewProduct(): Product {
    const product = new Product(this);
    // new product starts from draft status
    product.status = STATUSES.DRAFT;
    return product;
  }

  getProductImages(): Array<ProductImage> {
    return this.images.map((productImage) => new ProductImage(productImage));
  }
}
