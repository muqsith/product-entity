import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} from "graphql";
import { productImageType } from "./ProductImage";

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
    images: {
      type: new GraphQLList(productImageType),
    },
  },
});
