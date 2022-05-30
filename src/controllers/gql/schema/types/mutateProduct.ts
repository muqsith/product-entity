import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
} from "graphql";

export const mutateProduct = new GraphQLInputObjectType({
  name: "UpdateProduct",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLFloat,
    },
    categoryId: {
      type: GraphQLString,
    },
    status: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
  },
});
