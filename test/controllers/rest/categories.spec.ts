import express from "express";
import request from "supertest";

import { AppConfig, getConfig } from "../../../src/config/index";
import { getCategoriesController } from "../../../src/controllers/rest/categories";
import { DAL } from "../../../src/dal/index";
import { Category } from "../../../src/entities/Category";
import { errorHandler } from "../../../src/errorHandler";

describe("/api/rest/categories - ", () => {
  let dal: DAL = null;
  let config: AppConfig = null;
  const app = express().use(express.json());

  beforeAll(() => {
    config = getConfig(process.env.NODE_ENV);
    dal = new DAL(config, console);
    app
      .use("/api/rest/categories", getCategoriesController(dal))
      .use(errorHandler);
  });

  afterAll(async () => {
    await dal.dbConnection.close();
  });

  it("GET / - should get categories by parentId", async () => {
    const parentCategory = await dal.categoryAccess.addCategory(
      new Category({
        name: "Category controller test - parent - 1",
      })
    );

    for (let i = 0; i < 5; i += 1) {
      await dal.categoryAccess.addCategory(
        new Category({
          name: "Test category - 800" + i,
          parentId: parentCategory.id,
        })
      );
    }
    const response = await request(app).get(
      "/api/rest/categories?id=" + parentCategory.id
    );

    expect(response.status).toBe(200);
    expect(response.body.length > 2).toBeTruthy();
  });

  it("POST / - should create a new category", async () => {
    const parentCategory = await dal.categoryAccess.addCategory(
      new Category({
        name: "Category controller test - parent - 2",
      })
    );
    const response = await request(app)
      .post("/api/rest/categories")
      .set("Content-Type", "application/json")
      .send({
        name: "Test category 900",
        parentId: parentCategory.id,
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBeTruthy();
  });
});
