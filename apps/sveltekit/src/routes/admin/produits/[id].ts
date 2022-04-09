import { pictures as picturesCollection, products } from "$lib/db";
import type { Product } from "$lib/db/product";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async ({params}) => {
  const product = await products.findOne({_id: params.id});

  if (!product) {
    return {
      status: 404
    };
  }

  const pictures = await picturesCollection.find({productId: params.id}).sort({createdAt: 1}).toArray();

  product.photos = pictures;

  return {
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      product
    }
  };
};

export const post: RequestHandler = async({params, request}) => {
  const formData = await request.formData();

  const update = {
    ...(formData.get("name") && {name: formData.get("name") as string}),
    ...(formData.get("state") && {state: formData.get("state") as Product["state"]}),
    ...(formData.get("kind") && {kind: formData.get("kind") as Product["kind"]}),
    ...(formData.get("description") && {description: formData.get("description") as string}),
    ...(formData.get("price") && {price: Number(formData.get("price"))}),
  };

  await products.updateOne({_id: params.id}, {$set: update});

  return {
    status: 200
  };
};
