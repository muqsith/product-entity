export interface AppConfig {
  env: string;
  dbConnectionString: string;
  serverPort: number;
}

const config: AppConfig = {
  env: "development",
  dbConnectionString:
    "postgresql://product_dev:123456@localhost:5432/product_entity",
  serverPort: 8080,
};

export const getConfig = (): AppConfig => {
  return config;
};
