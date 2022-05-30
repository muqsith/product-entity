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
    const { name, categoryId, status, price, description, images } = input;
    const savedProduct = await context.productAccess.addProduct(
      new Product({ name, categoryId, status, price, description })
    );
    const responseObject: any = { ...savedProduct };
    // add images
    if (Array.isArray(images) && images.length > 0) {
      const savedImages = await context.productImageAccess.addProductImages(
        images.map((image) => {
          image.productId = savedProduct.id;
          return image;
        })
      );
      responseObject.images = savedImages;
    }
    return savedProduct;
  },
};
