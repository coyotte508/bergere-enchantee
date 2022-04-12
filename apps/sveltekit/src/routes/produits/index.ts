import { Products, Pictures } from "$lib/db";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async () => {
  const products = await Products.find({state: {$ne: "draft"}}).toArray();
  const pictures = await Pictures.find({productId: {$in: products.map(p => p._id)}}).sort({createdAt: 1}).toArray();

  const byId = Object.fromEntries(products.map(p => [p._id, p]));

  for (const picture of pictures) {
    byId[picture.productId].photos = [... (byId[picture.productId].photos || []), picture];
  }

  return {
    body: {
      published: products.filter(p => p.state === "published"),
      retired: products.filter(p => p.state === "retired"),
    }
  };
};