export interface AppConfig {
  dbConnectionString: string;
}

const config: AppConfig = {
  dbConnectionString: "postgresql://admin:admin@localhost:5432/products",
};

export const getConfig = (): AppConfig => {
  return config;
};
