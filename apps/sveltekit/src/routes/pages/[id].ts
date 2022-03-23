import { pages } from "$lib/db/page";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = (event) => {
  const pageId = decodeURIComponent(event.params.id);

  const page = pages[pageId];

  if (!page) {
    return {status: 404};
  }

  return {
    body: page
  };
};