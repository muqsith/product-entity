import { GraphQLObjectType } from "graphql";
import { categories } from "./queries/categories";
import { products } from "./queries/products";

export const query = new GraphQLObjectType({
  name: "Query",
  fields: (): any => ({
    categories,
    products,
  }),
});
