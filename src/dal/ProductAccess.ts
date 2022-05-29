import { Logger } from "../logger";
import { DBConnection } from "./DBConnection";
import { Product } from "./models/Product";

export class ProductAccess {
  dbConnection: DBConnection;
  logger: Logger;
  constructor(dbConnection: DBConnection, logger: Logger) {
    this.dbConnection = dbConnection;
    this.logger = logger;
  }

  async getProducts(): Promise<Array<Product>> {
    let result = [];
    const selectQuery = {
      text: "SELECT * FROM products",
      values: [],
    };
    const queryResult = await this.dbConnection.executeQuery(selectQuery);
    if (queryResult.rowCount > 0) {
      result = queryResult.rows.map((row) => new Product(row));
    }
    return result;
  }

  async getProduct(productId: string): Promise<Product> {
    let result = null;
    const selectQuery = {
      text: "SELECT * FROM products WHERE id = $1",
      values: [productId],
    };
    const queryResult = await this.dbConnection.executeQuery(selectQuery);
    if (queryResult.rowCount > 0) {
      result = new Product(queryResult.rows[0]);
    }
    return result;
  }

  async addProduct(newProduct: Product): Promise<Product> {
    let result = null;
    const insertQuery = {
      text: "INSERT INTO products (name, price, description, categoryid) VALUES ($1, $2, $3, $4) RETURNING *",
      values: [
        newProduct.name,
        newProduct.price,
        newProduct.description,
        newProduct.categoryId,
      ],
    };
    const queryResult = await this.dbConnection.executeQuery(insertQuery);
    if (queryResult.rowCount > 0) {
      result = new Product(queryResult.rows[0]);
    }
    return result;
  }

  async updateProduct(product: Product): Promise<Product> {
    let result = null;
    const updateQuery = {
      text: "UPDATE products SET name = $2, price = $3, description = $4, categoryid = $5 WHERE id = $1 RETURNING *",
      values: [
        product.id,
        product.name,
        product.price,
        product.description,
        product.categoryId,
      ],
    };
    const queryResult = await this.dbConnection.executeQuery(updateQuery);
    if (queryResult.rowCount > 0) {
      result = new Product(queryResult.rows[0]);
    }
    return result;
  }

  async deleteProduct(productId: string): Promise<Product> {
    let result = null;
    const archiveQuery = {
      text: "UPDATE products SET archived = $2 WHERE id = $1 RETURNING *",
      values: [productId, true],
    };
    const queryResult = await this.dbConnection.executeQuery(archiveQuery);
    if (queryResult.rowCount > 0) {
      result = new Product(queryResult.rows[0]);
    }
    return result;
  }
}
