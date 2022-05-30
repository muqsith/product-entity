import pathModule from "path";
import swaggerJsdoc from "swagger-jsdoc";

const controllersPath = pathModule.resolve(
  __dirname,
  "..",
  "..",
  "controllers"
);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Categories and Products API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8080/",
        description: "Local development server",
      },
    ],
  },
  apis: [controllersPath + "/**/*.js"], // files containing annotations as above
  tags: [
    {
      name: "CATEGORY",
      description: "Category API",
    },
    {
      name: "PRODUCT",
      description: "Product API",
    },
  ],
};

export const swaggerDocument = swaggerJsdoc(options);
