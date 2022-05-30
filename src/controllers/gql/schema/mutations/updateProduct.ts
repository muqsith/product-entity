import { GraphQLNonNull } from "graphql";
import { DAL } from "../../../../dal";
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
    let responseObject: any = null;
    const { id, name, categoryId, status, price, description, images } = input;
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
      const updateResult = await context.productAccess.updateProduct(
        existingProduct
      );
      responseObject = { ...updateProduct };
      // add images
      if (Array.isArray(images) && images.length > 0) {
        const savedImages = await context.productImageAccess.addProductImages(
          images.map((image) => {
            image.productId = updateResult.id;
            return image;
          })
        );
        responseObject.images = savedImages;
      }
    }
    return responseObject;
  },
};
