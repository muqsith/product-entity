import { GraphQLList, GraphQLString } from "graphql";

import { DAL } from "../../../../dal";
import { Category } from "../../../../entities/Category";
import { categoryType } from "../types/Category";

export const categories = {
  type: new GraphQLList(categoryType),
  args: {
    parentId: {
      type: GraphQLString,
      description: "Parent category ID",
    },
  },
  resolve: async (_, args: any, context: DAL) => {
    const parentId = args?.parentId;
    const savedCategories = parentId
      ? await context.categoryAccess.getCategoriesByParentId(parentId)
      : await context.categoryAccess.getCategories();
    const result = savedCategories.map((category: Category) => {
      return {
        id: category.id,
        name: category.name,
        parentId: category.parentId,
      };
    });
    return result;
  },
};
