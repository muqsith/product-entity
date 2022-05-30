import { GraphQLNonNull } from "graphql";
import { DAL } from "../../../../dal";
import { Product } from "../../../../entities/Product";
import { productType } from "../types/Product";
import { mutateProduct } from "../types/mutateProduct";

export const updateProduct = {
  type: productType,
  args: {
    input: {
      type: new GraphQLNonNull(mutateProduct),
    },
  },
  resolve: async (_, { input }, context: DAL) => {
    let result: Product = null;
    const { id, name, categoryId, status, price, description } = input;
    const existingProduct = await context.productAccess.getProduct(id);
    if (existingProduct) {
      if (name) {
        existingProduct.name = name;
      }
      if (categoryId) {
        existingProduct.categoryId = categoryId;
      }
      if (status) {
        existingProduct.transformStatus(status);
      }
      if (!isNaN(price) && price !== null) {
        existingProduct.price = price;
      }
      if (description) {
        existingProduct.description = description;
      }
      result = await context.productAccess.updateProduct(existingProduct);
    }
    return result;
  },
};
