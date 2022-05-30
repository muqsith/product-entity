import { AppConfig, getConfig } from "../../src/config/index";
import { DAL } from "../../src/dal/index";
import { Product } from "../../src/entities/Product";
import { Category } from "../../src/entities/Category";
import { STATUSES } from "../../src/constants/Product";

describe("ProductAccess -", () => {
  let dal: DAL = null;
  let config: AppConfig = null;
  beforeAll(() => {
    config = getConfig(process.env.NODE_ENV);
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
    const products = await dal.productAccess.addProducts([newProduct]);
    const product = products[0];
    const updatedProducts = await dal.productAccess.updateProductsStatus(
      [product.id],
      STATUSES.AVAILABLE
    );
    const updatedProduct = updatedProducts[0];
    expect(updatedProduct.status).toBe(STATUSES.AVAILABLE);
  });

  it("should get products", async () => {
    const category1 = await dal.categoryAccess.addCategory(
      new Category({
        name: "Category - c3001",
      })
    );
    const newProducts = [];
    for (let i = 0; i < 5; i += 1) {
      const newProduct = new Product({
        name: "Product - 200" + i,
        price: Math.random() * 100,
        description: "A product ... - " + i,
        categoryId: category1.id,
        status: STATUSES.DRAFT,
      });
      newProducts.push(newProduct);
    }
    await dal.productAccess.addProducts(newProducts);
    const products = await dal.productAccess.getProducts();
    expect(products.length > 0).toBeTruthy();
  });

  it("should get products by status", async () => {
    const category1 = await dal.categoryAccess.addCategory(
      new Category({
        name: "Category - c4001",
      })
    );
    const newProducts: Array<Product> = [];
    for (let i = 0; i < 10; i += 1) {
      const newProduct = new Product({
        name: "Product - 400" + i,
        price: Math.random() * 100,
        description: "A product ... - " + i,
        categoryId: category1.id,
        status: STATUSES.DRAFT,
      });
      newProducts.push(newProduct);
    }

    newProducts[1].status = STATUSES.AVAILABLE;
    newProducts[2].status = STATUSES.AVAILABLE;
    newProducts[3].status = STATUSES.RESERVED;
    newProducts[4].status = STATUSES.RESERVED;
    newProducts[5].status = STATUSES.SOLD;
    newProducts[6].status = STATUSES.SOLD;
    newProducts[7].status = STATUSES.SOLD;

    // save products
    await dal.productAccess.addProducts(newProducts);

    // get draft products
    const draftProducts = await dal.productAccess.getProductsByStatus(
      STATUSES.DRAFT
    );
    expect(draftProducts.length >= 3).toBeTruthy();

    // get available products
    const availableProducts = await dal.productAccess.getProductsByStatus(
      STATUSES.AVAILABLE
    );
    expect(availableProducts.length >= 2).toBeTruthy();

    // get reserved products
    const reservedProducts = await dal.productAccess.getProductsByStatus(
      STATUSES.RESERVED
    );
    expect(reservedProducts.length >= 2).toBeTruthy();

    // get sold products
    const soldProducts = await dal.productAccess.getProductsByStatus(
      STATUSES.SOLD
    );
    expect(soldProducts.length >= 3).toBeTruthy();
  });
});
