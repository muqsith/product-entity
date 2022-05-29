import { v4 } from "uuid";
import { Product } from "../../src/entities/Product";
import { STATUSES } from "../../src/constants/Product";
import { ProductTransitionError } from "../../src/errors/ProductTransitionError";

describe("Product entity -", () => {
  it("should make draft product available", () => {
    const categoryId = v4();
    const product = new Product({
      name: "Product - 1",
      price: 33.5,
      description: "A product ...",
      categoryId,
      status: STATUSES.DRAFT,
    });
    product.setStatus(STATUSES.AVAILABLE);
    expect(product.status).toBe(STATUSES.AVAILABLE);
  });

  it("should allow available product to be reserved", () => {
    const categoryId = v4();
    const product = new Product({
      name: "Product - 1",
      price: 33.5,
      description: "A product ...",
      categoryId,
      status: STATUSES.DRAFT,
    });
    product.setStatus(STATUSES.AVAILABLE);
    product.setStatus(STATUSES.RESERVED);
    expect(product.status).toBe(STATUSES.RESERVED);
  });

  it("should throw product transition error if a draft product is set as sold", () => {
    const categoryId = v4();
    const product = new Product({
      name: "Product - 1",
      price: 33.5,
      description: "A product ...",
      categoryId,
      status: STATUSES.DRAFT,
    });
    try {
      product.setStatus(STATUSES.SOLD);
    } catch (err) {
      expect(err).toBeInstanceOf(ProductTransitionError);
    }
  });
});
