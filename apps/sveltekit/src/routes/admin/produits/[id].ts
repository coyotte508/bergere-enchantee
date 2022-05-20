import { Pictures, Products } from "$lib/db";
import type { Product } from "$lib/db/product";
import type { RequestHandler } from "@sveltejs/kit";
import type { JSONObject } from "@sveltejs/kit/types/private";

export const get: RequestHandler = async ({params}) => {
  const product = await Products.findOne({_id: params.id});

  if (!product) {
    return {
      status: 404,
      body: {
        error: "Produit non trouvé"
      }
    };
  }

  const pictures = await Pictures.find({productId: params.id}).sort({createdAt: 1}).toArray();
  product.photos = pictures;

  return {
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      product
    } as unknown as JSONObject
  };
};

export const post: RequestHandler = async({params, request}) => {
  const formData = await request.formData();

  const update = {
    ...(formData.get("name") && {name: formData.get("name") as string}),
    ...(formData.get("state") && {state: formData.get("state") as Product["state"]}),
    ...(formData.get("kind") && {kind: formData.get("kind") as Product["kind"]}),
    ...(formData.get("description") && {description: (formData.get("description") as string).replaceAll("\r", "")}),
    ...(formData.get("price") && {price: Number(formData.get("price"))}),
    updatedAt: new Date(),
  };

  const product = await Products.findOneAndUpdate({_id: params.id}, {$set: update}, {returnDocument: "after"});

  if (!product.value) {
    return {
      status: 404,
      body: {
        error: "Produit non trouvé"
      }
    };
  }

  return {
    status: 200,
  };
};
