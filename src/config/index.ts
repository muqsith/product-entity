export interface AppConfig {
  dbConnectionString: string;
  serverPort: number;
}

const devConfig: AppConfig = {
  dbConnectionString:
    "postgresql://product_dev:123456@localhost:5432/product_entity",
  serverPort: 8080,
};

const testConfig: AppConfig = {
  dbConnectionString:
    "postgresql://product_test:123456@localhost:5432/test_product_entity",
  serverPort: 8080,
};

export const getConfig = (env): AppConfig => {
  let config = devConfig;
  if (env === "test") {
    config = testConfig;
  }
  return config;
};
