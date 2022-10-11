throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");

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