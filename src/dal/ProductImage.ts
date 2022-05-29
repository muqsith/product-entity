import { Logger } from "../logger";
import { DBConnection } from "./DBConnection";
import { ProductImage } from "../entities/ProductImage";

export class ProductImageAccess {
  dbConnection: DBConnection;
  logger: Logger;
  constructor(dbConnection: DBConnection, logger: Logger) {
    this.dbConnection = dbConnection;
    this.logger = logger;
  }

  async getProductImages(productId): Promise<Array<ProductImage>> {
    let result = null;
    const selectQuery = {
      text: "SELECT * FROM product_images WHERE productid = $1",
      values: [productId],
    };
    const queryResult = await this.dbConnection.executeQuery(selectQuery);
    if (queryResult.rowCount > 0) {
      result = queryResult.rows.map((row) => new ProductImage(row));
    }
    return result;
  }

  async getProductImage(productImageId: string): Promise<ProductImage> {
    let result = null;
    const selectQuery = {
      text: "SELECT * FROM product_images WHERE id = $1",
      values: [productImageId],
    };
    const queryResult = await this.dbConnection.executeQuery(selectQuery);
    if (queryResult.rowCount > 0) {
      result = new ProductImage(queryResult.rows[0]);
    }
    return result;
  }

  async addProductImages(
    newProductImages: Array<ProductImage>
  ): Promise<Array<ProductImage>> {
    let result = [];
    const queries = [];
    for (const newProductImage of newProductImages) {
      const insertQuery = {
        text: "INSERT INTO product_images (productid, url, main) VALUES ($1, $2, $3) RETURNING *",
        values: [
          newProductImage.productId,
          newProductImage.url,
          newProductImage.main,
        ],
      };
      queries.push(insertQuery);
    }
    const txnQueryResult = await this.dbConnection.executeTransaction(queries);
    if (txnQueryResult.length > 0) {
      result = txnQueryResult.map((queryResult) => {
        let savedProductImage = null;
        if (queryResult.rowCount > 0) {
          savedProductImage = new ProductImage(queryResult.rows[0]);
        }
        return savedProductImage;
      });
    }
    return result;
  }

  async updateProductImage(productImage: ProductImage): Promise<ProductImage> {
    let result = null;
    const updateQuery = {
      text: "UPDATE product_images SET productid = $2, url = $3, main = $4 WHERE id = $1 RETURNING *",
      values: [
        productImage.id,
        productImage.productId,
        productImage.url,
        productImage.main,
      ],
    };
    const queryResult = await this.dbConnection.executeQuery(updateQuery);
    if (queryResult.rowCount > 0) {
      result = new ProductImage(queryResult.rows[0]);
    }
    return result;
  }

  async deleteProductImages(
    productImageIds: Array<string>
  ): Promise<Array<ProductImage>> {
    let result = [];
    const queries = [];
    for (const productImageId of productImageIds) {
      const archiveQuery = {
        text: "UPDATE product_images SET archived = $2 WHERE id = $1 RETURNING *",
        values: [productImageId, true],
      };
      queries.push(archiveQuery);
    }

    const txnQueryResult = await this.dbConnection.executeTransaction(queries);
    if (txnQueryResult.length > 0) {
      result = txnQueryResult.map((queryResult) => {
        let archivedProductImage = null;
        if (queryResult.rowCount > 0) {
          archivedProductImage = new ProductImage(queryResult.rows[0]);
        }
        return archivedProductImage;
      });
    }
    return result;
  }
}
