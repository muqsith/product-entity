import { Pool, QueryResult } from "pg";
import { Logger } from "../logger";
import { AppConfig } from "../config/index";

export interface SQLQuery {
  text: string;
  values: Array<any>;
}

export class DBConnection {
  pool: Pool;
  logger: Logger;
  constructor(config: AppConfig, logger: Logger) {
    const connectionString = config.dbConnectionString;
    if (!connectionString) {
      throw new Error("DB connection string missing in the config");
    }

    this.logger = logger;

    // initialize connection pool
    this.pool = new Pool({
      connectionString,
    });

    this.pool.on("error", (err) => {
      this.logger.error(
        "Error occued while establishing connection to the database",
        err
      );
    });
  }

  async getNewClient() {
    return await this.pool.connect();
  }

  async executeQuery(query: SQLQuery): Promise<QueryResult> {
    let queryError = null;
    let queryResult = null;
    const dbClient = await this.getNewClient();
    try {
      queryResult = await dbClient.query(query);
    } catch (err) {
      queryError = err;
      this.logger.error("Error occured while running a query", err);
    }

    dbClient.release();

    if (queryError) {
      throw queryError;
    }
    return queryResult;
  }

  async executeTransaction(queries: Array<SQLQuery>) {
    let txnError = null;
    const txnResults: Array<QueryResult> = [];

    const beginQuery = {
      text: "BEGIN",
      values: [],
    };
    const commitQuery = {
      text: "COMMIT",
      values: [],
    };
    const rollbackQuery = {
      text: "ROLLBACK",
      values: [],
    };

    const dbClient = await this.getNewClient();

    await this.executeQuery(beginQuery);
    try {
      for (const query of queries) {
        const result = await dbClient.query(query);
        txnResults.push(result);
      }
      await this.executeQuery(commitQuery);
    } catch (err) {
      txnError = err;
      this.logger.error("Error occured whilre running a db transaction", err);
      await this.executeQuery(rollbackQuery);
    }

    dbClient.release();

    if (txnError) {
      throw txnError;
    }
    return txnResults;
  }

  async close() {
    this.pool.end();
  }
}
