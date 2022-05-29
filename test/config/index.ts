export interface AppConfig {
    dbConnectionString: string;
  }
  
  const config: AppConfig = {
    dbConnectionString: "postgresql://product_test:123456@localhost:5432/test_product_entity",
  };
  
  export const getConfig = (): AppConfig => {
    return config;
  };
  