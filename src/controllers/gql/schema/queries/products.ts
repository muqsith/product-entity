import { GraphQLList, GraphQLString } from "graphql";
import { DAL } from "../../../../dal";
import { Product } from "../../../../entities/Product";

import { productType } from "../types/Product";

export const products = {
  type: new GraphQLList(productType),
  args: {
    status: {
      type: GraphQLString,
      description: "Product status",
    },
  },
  resolve: async (_, args: any, context: DAL) => {
    const status = args?.status;

    const savedProducts = status
      ? await context.productAccess.getProductsByStatus(status)
      : await context.productAccess.getProducts();
    const result = savedProducts.map((product: Product) => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        status: product.status,
        categoryId: product.categoryId,
        description: product.description,
      };
    });
    return result;
  },
};
