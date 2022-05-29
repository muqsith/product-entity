import { AppConfig } from "../config";
import { Logger } from "../logger";
import { CategoryAccess } from "./CategoryAccess";
import { DBConnection } from "./DBConnection";
import { ProductAccess } from "./ProductAccess";
import { ProductImageAccess } from "./ProductImage";

/**
 * DAL - DAL (Data Access Layer) module is responsible for all database interactions
 */
export class DAL {
  dbConnection: DBConnection;
  logger: Logger;
  categoryAccess: CategoryAccess;
  productAccess: ProductAccess;
  productImageAccess: ProductImageAccess;

  constructor(config: AppConfig, logger: Logger) {
    this.dbConnection = new DBConnection(config, logger);
    this.logger = logger;
    this.categoryAccess = new CategoryAccess(this.dbConnection, this.logger);
    this.productAccess = new ProductAccess(this.dbConnection, this.logger);
    this.productImageAccess = new ProductImageAccess(
      this.dbConnection,
      this.logger
    );
  }
}
