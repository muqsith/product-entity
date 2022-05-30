import { GraphQLObjectType, GraphQLString, GraphQLFloat } from "graphql";

export const productType = new GraphQLObjectType({
  name: "Product",
  fields: {
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLFloat,
    },
    status: {
      type: GraphQLString,
    },
    categoryId: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
  },
});
