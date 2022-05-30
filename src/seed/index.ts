// seed data for dev environment

import { STATUSES } from "../constants/Product";
import { DAL } from "../dal";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { ProductImage } from "../entities/ProductImage";

export const loadSeedData = async (dal: DAL) => {
  const products = await dal.productAccess.getProducts();
  if (products.length > 0) return;

  const parentCategory1 = await dal.categoryAccess.addCategory(
    new Category({
      name: "Apparels",
    })
  );

  const childCategory1 = await dal.categoryAccess.addCategory(
    new Category({
      name: "Shirts",
      parentId: parentCategory1.id,
    })
  );

  const product1 = await dal.productAccess.addProduct(
    new Product({
      name: "Cotton shirt",
      price: 35.5,
      categoryId: childCategory1.id,
      status: STATUSES.AVAILABLE,
    })
  );

  await dal.productImageAccess.addProductImages([
    new ProductImage({
      productId: product1.id,
      url: "http://example.com/cotton-shirt1.png",
      main: true,
    }),
    new ProductImage({
      productId: product1.id,
      url: "http://example.com/cotton-shirt2.png",
    }),
    new ProductImage({
      productId: product1.id,
      url: "http://example.com/cotton-shirt3.png",
    }),
  ]);

  const product2 = await dal.productAccess.addProduct(
    new Product({
      name: "Tropical shirt",
      price: 15.5,
      categoryId: childCategory1.id,
      status: STATUSES.AVAILABLE,
    })
  );

  await dal.productImageAccess.addProductImages([
    new ProductImage({
      productId: product2.id,
      url: "http://example.com/tropical-shirt1.png",
    }),
    new ProductImage({
      productId: product2.id,
      url: "http://example.com/tropical-shirt2.png",
      main: true,
    }),
  ]);

  const paretnCategory2 = await dal.categoryAccess.addCategory(
    new Category({
      name: "Accessories",
    })
  );

  const childCategory2 = await dal.categoryAccess.addCategory(
    new Category({
      name: "Caps",
      parentId: paretnCategory2.id,
    })
  );

  const product3 = await dal.productAccess.addProduct(
    new Product({
      name: "Baseball cap",
      price: 25.75,
      categoryId: childCategory2.id,
      status: STATUSES.DRAFT,
    })
  );

  await dal.productImageAccess.addProductImages([
    new ProductImage({
      productId: product3.id,
      url: "http://example.com/cotton-shirt1.png",
      main: true,
    }),
  ]);
};
