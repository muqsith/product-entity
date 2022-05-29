import { AppConfig, getConfig } from "../config/index";
import { DAL } from "../../src/dal/index";
import { ProductImage } from "../../src/dal/models/ProductImage";
import { Product } from "../../src/dal/models/Product";
import { Category } from "../../src/dal/models/Category";
import { STATUSES } from "../../src/constants/Product";

describe("ProductImageAccess -", () => {
  let dal: DAL = null;
  let config: AppConfig = null;
  beforeAll(() => {
    config = getConfig();
    dal = new DAL(config, console);
  });
  afterAll(async () => {
    await dal.dbConnection.close();
  });

  it("should add new product images", async () => {
    const category = await dal.categoryAccess.addCategory(
      new Category({
        name: "Category - c1",
      })
    );
    const product = await dal.productAccess.addProduct(
      new Product({
        name: "Product - 1",
        categoryId: category.id,
        status: STATUSES.DRAFT,
      })
    );
    const newProductImages = [];
    for (let i = 0; i < 5; i += 1) {
      const newProductImage = new ProductImage({
        url: "http://example.com/image-" + i + ".png",
        productId: product.id,
        main: i === 3 ? true : false,
      });
      newProductImages.push(newProductImage);
    }
    const savedProductImages = await dal.productImageAccess.addProductImages(
      newProductImages
    );
    expect(savedProductImages.length > 0).toBeTruthy();
    expect(
      savedProductImages.some(
        (savedProductImage) => savedProductImage.main === true
      )
    ).toBeTruthy();
  });

  it("should update an existing product image", async () => {
    const category = await dal.categoryAccess.addCategory(
      new Category({
        name: "Category - c2",
      })
    );
    const product = await dal.productAccess.addProduct(
      new Product({
        name: "Product - 2",
        categoryId: category.id,
        status: STATUSES.DRAFT,
      })
    );
    const newProductImage = new ProductImage({
      url: "http://example.com/image-1002.png",
      productId: product.id,
      main: false,
    });
    const newProductImages = [newProductImage];

    const savedProductImages = await dal.productImageAccess.addProductImages(
      newProductImages
    );
    const savedProductImage = savedProductImages[0];
    savedProductImage.main = true;
    const updatedProductImage = await dal.productImageAccess.updateProductImage(
      savedProductImage
    );
    expect(updatedProductImage.main).toBe(true);
  });

  it("should get product images", async () => {
    const category = await dal.categoryAccess.addCategory(
      new Category({
        name: "Category - c3",
      })
    );
    const product = await dal.productAccess.addProduct(
      new Product({
        name: "Product - 3001",
        categoryId: category.id,
        status: STATUSES.DRAFT,
      })
    );
    const newProductImages = [];
    for (let i = 0; i < 5; i += 1) {
      const newProductImage = new ProductImage({
        url: "http://example.com/image-" + i + ".png",
        productId: product.id,
        main: i === 2 ? true : false,
      });
      newProductImages.push(newProductImage);
    }
    await dal.productImageAccess.addProductImages(newProductImages);
    const savedProductImages = await dal.productImageAccess.getProductImages(
      product.id
    );
    expect(savedProductImages.length > 0).toBeTruthy();
    expect(
      savedProductImages.some(
        (savedProductImage) => savedProductImage.main === true
      )
    ).toBeTruthy();
  });
});
