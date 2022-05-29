export interface AppConfig {
  dbConnectionString: string;
}

const config: AppConfig = {
  dbConnectionString: "postgresql://product_dev:123456@localhost:5432/product_entity",
};

export const getConfig = (): AppConfig => {
  return config;
};
