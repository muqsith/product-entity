import { GraphQLNonNull } from "graphql";
import { DAL } from "../../../../dal";
import { Product } from "../../../../entities/Product";
import { productType } from "../types/Product";
import { newProduct } from "../types/newProduct";

export const createProduct = {
  type: productType,
  args: {
    input: {
      type: new GraphQLNonNull(newProduct),
    },
  },
  resolve: async (_, { input }, context: DAL) => {
    const { name, categoryId, status, price, description } = input;
    const savedProduct = await context.productAccess.addProduct(
      new Product({ name, categoryId, status, price, description })
    );
    return savedProduct;
  },
};
