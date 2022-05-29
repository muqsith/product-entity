import { AppConfig, getConfig } from "../config/index";
import { DAL } from "../../src/dal/index";
import { Product } from "../../src/dal/models/Product";
import { Category } from "../../src/dal/models/Category";
import { STATUSES } from "../../src/constants/Product";

describe("ProductAccess -", () => {
  let dal: DAL = null;
  let config: AppConfig = null;
  beforeAll(() => {
    config = getConfig();
    dal = new DAL(config, console);
  });
  afterAll(async () => {
    await dal.dbConnection.close();
  });

  it("should add a new product", async () => {
    const category = await dal.categoryAccess.addCategory(
      new Category({
        name: "Category - c1",
      })
    );
    const newProduct = new Product({
      name: "Product - 1",
      price: 33.5,
      description: "A product ...",
      categoryId: category.id,
      status: STATUSES.DRAFT,
    });
    const savedProduct = await dal.productAccess.addProduct(newProduct);
    expect(savedProduct.id).toBeTruthy();
  });

  it("should update an existing product", async () => {
    const category1 = await dal.categoryAccess.addCategory(
      new Category({
        name: "Category - c1",
      })
    );
    const category2 = await dal.categoryAccess.addCategory(
      new Category({
        name: "Category - c2",
        parentId: category1.id,
      })
    );
    const newProduct = new Product({
      name: "Product - 2",
      price: 25.75,
      description: "A product ...",
      categoryId: category1.id,
      status: STATUSES.DRAFT,
    });
    const product = await dal.productAccess.addProduct(newProduct);
    product.categoryId = category2.id;
    const updatedName = "Product - 2002";
    product.name = updatedName;
    const updatedProduct = await dal.productAccess.updateProduct(product);
    expect(updatedProduct.categoryId).toBe(category2.id);
    expect(updatedProduct.name).toBe(updatedName);
  });

  it("should update status of an existing product", async () => {
    const category1 = await dal.categoryAccess.addCategory(
      new Category({
        name: "Category - c4",
      })
    );

    const newProduct = new Product({
      name: "Product - 4",
      price: 25.75,
      description: "A product ...",
      categoryId: category1.id,
      status: STATUSES.DRAFT,
    });
    const product = await dal.productAccess.addProduct(newProduct);
    const updatedProduct = await dal.productAccess.updateStatus(
      product.id,
      STATUSES.AVAILABLE
    );
    expect(updatedProduct.status).toBe(STATUSES.AVAILABLE);
  });

  it("should get products", async () => {
    const category1 = await dal.categoryAccess.addCategory(
      new Category({
        name: "Category - c3001",
      })
    );
    for (let i = 0; i < 5; i += 1) {
      const newProduct = new Product({
        name: "Product - 200" + i,
        price: Math.random() * 100,
        description: "A product ... - " + i,
        categoryId: category1.id,
        status: STATUSES.DRAFT,
      });
      await dal.productAccess.addProduct(newProduct);
    }
    const products = await dal.productAccess.getProducts();
    expect(products.length > 0).toBeTruthy();
  });
});
