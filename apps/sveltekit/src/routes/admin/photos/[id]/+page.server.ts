throw new Error("@migration task: Update +page.server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");

import type { Picture } from "$lib/db/picture";
import { client, Pictures, PicturesFs } from "$lib/db";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async ({params}) => {
  const picture = await Pictures.findOne({_id: params.id});
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
  await Pictures.updateOne({
    _id: params.id
  }, {
    $set: {
      name: String((await request.formData()).get("name")),
      updatedAt: new Date(),
    }
  });

  return {
    status: 200
  };
};

export const del: RequestHandler = async ({params}) => {
  let picture: Picture;
  await client.withSession(async (session) => {
    picture = (await Pictures.findOneAndDelete({_id: params.id}, {session})).value;
    await PicturesFs.deleteMany({"picture": params.id}, {session});
  });
  
  return {
    status: 303,
    headers: {
      location: picture?.productId ? "/admin/produits/" + picture.productId : "/admin/photos"
    }
  };
};