import express from "express";
import request from "supertest";

import { AppConfig, getConfig } from "../../../src/config/index";
import { STATUSES } from "../../../src/constants/Product";
import { getProductsController } from "../../../src/controllers/rest/products";
import { DAL } from "../../../src/dal/index";
import { Category } from "../../../src/entities/Category";
import { Product } from "../../../src/entities/Product";
import { errorHandler } from "../../../src/errorHandler";

describe("/api/rest/products - ", () => {
  let dal: DAL = null;
  let config: AppConfig = null;
  const app = express().use(express.json());

  beforeAll(() => {
    config = getConfig(process.env.NODE_ENV);
    dal = new DAL(config, console);
    app.use("/api/rest/products", getProductsController(dal)).use(errorHandler);
  });

  afterAll(async () => {
    await dal.dbConnection.close();
  });

  it("GET / - should get products by status", async () => {
    const category = await dal.categoryAccess.addCategory(
      new Category({
        name: "Controller test - 0",
      })
    );

    for (let i = 0; i < 5; i += 1) {
      await dal.productAccess.addProduct(
        new Product({
          name: "Test product - 4777" + i,
          categoryId: category.id,
          price: 5 * i,
          status: i < 2 ? STATUSES.DRAFT : STATUSES.AVAILABLE,
        })
      );
    }
    const response = await request(app).get(
      "/api/rest/products?status=AVAILABLE"
    );

    expect(response.status).toBe(200);
    expect(response.body.length > 2).toBeTruthy();
  });

  it("POST / - should create product", async () => {
    const category = await dal.categoryAccess.addCategory(
      new Category({
        name: "Controller test - 1",
      })
    );
    const response = await request(app)
      .post("/api/rest/products")
      .set("Content-Type", "application/json")
      .send({
        name: "Test product - 1",
        price: 100.05,
        categoryId: category.id,
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBeTruthy();
  });

  it("PUT / - should update product status", async () => {
    const category = await dal.categoryAccess.addCategory(
      new Category({
        name: "Controller test - 2",
      })
    );
    const productData = {
      name: "Test product - 1",
      price: 100.05,
      categoryId: category.id,
      status: STATUSES.DRAFT,
    };
    const product = await dal.productAccess.addProduct(
      new Product(productData)
    );
    const response = await request(app)
      .put("/api/rest/products")
      .set("Content-Type", "application/json")
      .send({
        ...productData,
        id: product.id,
        status: STATUSES.AVAILABLE,
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(STATUSES.AVAILABLE);
  });

  it("PUT / - should give 400 Bad Request response if product status change is invalid", async () => {
    const category = await dal.categoryAccess.addCategory(
      new Category({
        name: "Controller test - 3",
      })
    );
    const productData = {
      name: "Test product - 3",
      price: 99.05,
      categoryId: category.id,
      status: STATUSES.DRAFT,
    };
    const product = await dal.productAccess.addProduct(
      new Product(productData)
    );
    const response = await request(app)
      .put("/api/rest/products")
      .set("Content-Type", "application/json")
      .send({
        ...productData,
        id: product.id,
        status: STATUSES.RETURNED,
      });

    expect(response.status).toBe(400);
    expect(response.text).toContain("status DRAFT cannot be set to RETURNED");
  });
});
