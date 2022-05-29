import { AppConfig, getConfig } from "../config/index";
import { DAL } from "../../src/dal/index";
import { Category } from "../../src/entities/Category";

describe("CategoryAccess -", () => {
  let dal: DAL = null;
  let config: AppConfig = null;
  beforeAll(() => {
    config = getConfig();
    dal = new DAL(config, console);
  });
  afterAll(async () => {
    await dal.dbConnection.close();
  });

  it("should add a new category", async () => {
    const newCategory = new Category({
      parentId: null,
      name: "Category - 1",
    });
    const savedCategory = await dal.categoryAccess.addCategory(newCategory);
    expect(savedCategory.id).toBeTruthy();
  });

  it("should update an existing category", async () => {
    const newParentCategory = new Category({
      parentId: null,
      name: "Parent category - 1",
    });
    const newCategory = new Category({
      parentId: null,
      name: "Category - 2",
    });
    const parentCategory = await dal.categoryAccess.addCategory(
      newParentCategory
    );
    const category = await dal.categoryAccess.addCategory(newCategory);
    category.parentId = parentCategory.id;
    const updatedName = "Category - 1002";
    category.name = updatedName;
    const updatedCategory = await dal.categoryAccess.updateCategory(category);
    expect(updatedCategory.parentId).toBe(parentCategory.id);
    expect(updatedCategory.name).toBe(updatedName);
  });

  it("should get categories", async () => {
    for (let i = 0; i < 5; i += 1) {
      const newCategory = new Category({
        parentId: null,
        name: "Category - 200" + i,
      });
      await dal.categoryAccess.addCategory(newCategory);
    }
    const categories = await dal.categoryAccess.getCategories();
    expect(categories.length > 0).toBeTruthy();
  });

  it("should get categories by parent id", async () => {
    const parentCategory = await dal.categoryAccess.addCategory(
      new Category({
        parentId: null,
        name: "Prent category - 5002",
      })
    );
    for (let i = 0; i < 3; i += 1) {
      const newCategory = new Category({
        parentId: parentCategory.id,
        name: "Category - 200" + i,
      });
      await dal.categoryAccess.addCategory(newCategory);
    }
    const childCategories = await dal.categoryAccess.getCategoriesByParentId(
      parentCategory.id
    );
    expect(childCategories.length === 3).toBeTruthy();
  });
});
