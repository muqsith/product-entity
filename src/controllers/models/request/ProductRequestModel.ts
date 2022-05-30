import Joi from "joi";
import { STATUSES } from "../../../constants/Product";
import { DAL } from "../../../dal";
import { Product } from "../../../entities/Product";
import { ProductImage } from "../../../entities/ProductImage";
import { ProductImageRequestModel } from "./ProductImageRequestModel";

const baseValidationSchema = {
  name: Joi.string().min(3).max(500).required(),
  price: Joi.number().min(0).max(100000).required(),
  categoryId: Joi.string().uuid().required(),
};
const productCreateValidationSchema = Joi.object({ ...baseValidationSchema });
const productUpdateValidationSchema = Joi.object({
  ...baseValidationSchema,
  id: Joi.string().uuid().required(),
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
    const validationResult = productCreateValidationSchema.validate({
      name: this.name,
      price: this.price,
      categoryId: this.categoryId,
    });
    if (validationResult.error) {
      const errorMessage = validationResult.error.message;
      throw new Error(errorMessage);
    }
    if (this.images.length > 0) {
      this.images.forEach((image) => image.validate());
      const hasOneMainImage = this.images.some((image) => Boolean(image.main));
      if (!hasOneMainImage) {
        throw new Error("At least one image must be main");
      }
    }
  }

  async validateUpdate(dal: DAL) {
    const validationResult = productUpdateValidationSchema.validate({
      id: this.id,
      name: this.name,
      price: this.price,
      categoryId: this.categoryId,
    });
    if (validationResult.error) {
      const errorMessage = validationResult.error.message;
      throw new Error(errorMessage);
    }

    const savedProduct = await dal.productAccess.getProduct(this.id);
    if (!savedProduct) {
      throw new Error(`Product with id :${this.id} not found`);
    }

    // validate if the status can be transformed to new status
    if (this.status !== savedProduct.status) {
      savedProduct.transformStatus(this.status);
    }

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
