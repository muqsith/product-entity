import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} from "graphql";

import { newProductImage } from "./newProductImage";

export const newProduct = new GraphQLInputObjectType({
  name: "NewProduct",
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    price: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    categoryId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      type: GraphQLString,
    },
    images: {
      type: new GraphQLList(newProductImage),
    },
  },
});
