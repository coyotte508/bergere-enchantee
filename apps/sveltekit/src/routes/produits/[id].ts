import { Products, Pictures } from "$lib/db";
import type { RequestHandler } from "@sveltejs/kit";
import type { JSONObject } from "@sveltejs/kit/types/private";

export const get: RequestHandler = async ({params}) => {
  const product = await Products.findOne({_id: params.id, state: {$ne: "draft"}});

  if (!product) {
    return {status: 404};
  }

  product.photos = await Pictures.find({productId: params.id}).sort({createdAt: 1}).toArray();

  return {
    body: {
      product
    } as unknown as JSONObject
  };
};