import { GraphQLList, GraphQLString } from "graphql";
import { DAL } from "../../../../dal";

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
    let result: Array<any> = [];
    const savedProducts = status
      ? await context.productAccess.getProductsByStatus(status)
      : await context.productAccess.getProducts();
    for (const savedProduct of savedProducts) {
      const productId = savedProduct.id;
      const productImages = await context.productImageAccess.getProductImages(
        productId
      );
      const product = {
        id: savedProduct.id,
        name: savedProduct.name,
        price: savedProduct.price,
        status: savedProduct.status,
        categoryId: savedProduct.categoryId,
        description: savedProduct.description,
        images: productImages.map((productImage) => {
          return {
            id: productImage.id,
            url: productImage.url,
            main: productImage.main,
            archived: productImage.archived,
          };
        }),
      };
      result.push(product);
    }
    return result;
  },
};
