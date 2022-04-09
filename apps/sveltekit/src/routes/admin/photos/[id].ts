import type { Picture } from "$lib/db/picture";
import { client, pictures, picturesFs } from "$lib/db";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async ({params}) => {
  const picture = await pictures.findOne({_id: params.id});
  return {
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      photo: picture
    }
  };
};

export const post: RequestHandler = async({params, request}) => {
  await pictures.updateOne({_id: params.id}, {$set: {name: String((await request.formData()).get("name"))}});

  return {
    status: 200
  };
};

export const del: RequestHandler = async ({params}) => {
  let picture: Picture;
  await client.withSession(async (session) => {
    picture = (await pictures.findOneAndDelete({_id: params.id}, {session})).value;
    await picturesFs.deleteMany({"picture": params.id}, {session});
  });
  
  return {
    status: 303,
    headers: {
      location: picture?.productId ? "/admin/produits/" + picture.productId : "/admin/photos"
    }
  };
};