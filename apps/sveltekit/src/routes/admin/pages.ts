import { pictures } from "$lib/db";
import { pages } from "$lib/db/page";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async ({locals}) => {
  if (!locals.admin) {
    return {
      status: 403,
      body: {
        message: "Vous devez être admin"
      }
    };
  }

  return {
    body: {
      pages: Object.values(pages),
      photos: await pictures.find({}).toArray(),
    }
  };
};