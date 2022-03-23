import { pages } from "$lib/db/page";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = (event) => {
  const pageId = decodeURIComponent(event.params.id);

  return {
    body: JSON.stringify(pages[pageId])
  };
};