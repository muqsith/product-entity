import { GraphQLObjectType, GraphQLString } from "graphql";

export const categoryType = new GraphQLObjectType({
  name: "Category",
  fields: {
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    parentId: {
      type: GraphQLString,
    },
  },
});
