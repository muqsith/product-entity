import { Logger } from "../logger";
import { DBConnection } from "./DBConnection";
import { Category } from "./models/Category";

export class CategoryAccess {
  dbConnection: DBConnection;
  logger: Logger;
  constructor(dbConnection: DBConnection, logger: Logger) {
    this.dbConnection = dbConnection;
    this.logger = logger;
  }

  async getCategories(): Promise<Array<Category>> {
    let result = [];
    const selectQuery = {
      text: "SELECT * FROM categories",
      values: [],
    };
    const queryResult = await this.dbConnection.executeQuery(selectQuery);
    if (queryResult.rowCount > 0) {
      result = queryResult.rows.map((row) => new Category(row));
    }
    return result;
  }

  async getCategory(categoryId: string): Promise<Category> {
    let result = null;
    const selectQuery = {
      text: "SELECT * FROM categories WHERE id = $1",
      values: [categoryId],
    };
    const queryResult = await this.dbConnection.executeQuery(selectQuery);
    if (queryResult.rowCount > 0) {
      result = new Category(queryResult.rows[0]);
    }
    return result;
  }

  async addCategory(newCategory: Category): Promise<Category> {
    let result = null;
    const insertQuery = {
      text: "INSERT INTO categories (parentid, name) VALUES ($1, $2) RETURNING *",
      values: [newCategory.parentId, newCategory.name],
    };
    const queryResult = await this.dbConnection.executeQuery(insertQuery);
    if (queryResult.rowCount > 0) {
      result = new Category(queryResult.rows[0]);
    }
    return result;
  }

  async updateCategory(category: Category): Promise<Category> {
    let result = null;
    const updateQuery = {
      text: "UPDATE categories SET parentid = $2, name = $3 WHERE id = $1 RETURNING *",
      values: [category.id, category.parentId, category.name],
    };
    const queryResult = await this.dbConnection.executeQuery(updateQuery);
    if (queryResult.rowCount > 0) {
      result = new Category(queryResult.rows[0]);
    }
    return result;
  }

  async deleteCategory(categoryId: string) {
    let result = null;
    const archiveQuery = {
      text: "UPDATE categories SET archived = $2 WHERE id = $1 RETURNING *",
      values: [categoryId, true],
    };
    const queryResult = await this.dbConnection.executeQuery(archiveQuery);
    if (queryResult.rowCount > 0) {
      result = new Category(queryResult.rows[0]);
    }
    return result;
  }
}
