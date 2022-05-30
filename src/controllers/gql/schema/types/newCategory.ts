import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";

export const newCategory = new GraphQLInputObjectType({
  name: "NewCategory",
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    parentId: {
      type: GraphQLString,
    },
  },
});

