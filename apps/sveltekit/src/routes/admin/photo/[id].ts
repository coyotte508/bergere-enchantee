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

export const del: RequestHandler = async ({params}) => {
  await client.withSession(async (session) => {
    await pictures.deleteOne({_id: params.id}, {session});
    await picturesFs.deleteMany({"picture": params.id}, {session});
  });
  
  return {
  };
};