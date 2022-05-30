import { GraphQLNonNull } from "graphql";
import { DAL } from "../../../../dal";
import { Category } from "../../../../entities/Category";
import { categoryType } from "../types/Category";
import { newCategory } from "../types/newCategory";

export const createCategory = {
  type: categoryType,
  args: {
    input: {
      type: new GraphQLNonNull(newCategory),
    },
  },
  resolve: async (_, { input }, context: DAL) => {
    const { name, parentId } = input;
    const savedCategory = await context.categoryAccess.addCategory(
      new Category({ name, parentId })
    );
    return savedCategory;
  },
};
