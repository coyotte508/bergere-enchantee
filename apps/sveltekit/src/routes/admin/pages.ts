import { pictures } from "$lib/db";
import { pages } from "$lib/db/page";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async () => {
  return {
    body: {
      pages: Object.values(pages),
      photos: await pictures.find({}).toArray(),
    }
  };
};