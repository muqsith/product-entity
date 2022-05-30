import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from "graphql";

export const productImageType = new GraphQLObjectType({
  name: "ProductImage",
  fields: {
    id: {
      type: GraphQLString,
    },
    url: {
      type: GraphQLString,
    },
    main: {
      type: GraphQLBoolean,
    },
    archived: {
      type: GraphQLBoolean,
    },
  },
});
