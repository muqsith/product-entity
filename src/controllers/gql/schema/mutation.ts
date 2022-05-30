import { GraphQLObjectType } from "graphql";
import { createCategory } from "./mutations/createCategory";
import { createProduct } from "./mutations/createProduct";
import { updateProduct } from "./mutations/updateProduct";

export const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: (): any => ({
    createCategory,
    createProduct,
    updateProduct,
  }),
});
