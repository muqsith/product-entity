import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from "graphql";

export const newProductImage = new GraphQLInputObjectType({
  name: "NewProductImage",
  fields: {
    url: {
      type: new GraphQLNonNull(GraphQLString),
    },
    main: {
      type: GraphQLBoolean,
    },
    archive: {
      type: GraphQLBoolean,
    },
  },
});
