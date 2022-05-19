import { Pictures } from "$lib/db";
import { pages } from "$lib/db/page";
import type { RequestHandler } from "@sveltejs/kit";
import type { JSONObject } from "@sveltejs/kit/types/private";

export const get: RequestHandler = async () => {
  return {
    body: {
      pages: Object.values(pages),
      photos: await Pictures.find({productId: {$exists: false}}).toArray(),
    } as JSONObject
  };
};