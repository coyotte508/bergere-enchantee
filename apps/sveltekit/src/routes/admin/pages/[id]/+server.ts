throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");

import { pages as pagesCollection } from "$lib/db";
import { pages } from "$lib/db/page";
import type { RequestHandler } from "@sveltejs/kit";

export const post: RequestHandler = async (input) => {
  const pageId = decodeURIComponent(input.params.id);
  const body: {type: "picture" | "text", key: string, value: string} = await input.request.json();

  const type = body.type === "picture" ? "pictures": body.type;
  if (!(body.key in pages[pageId][type])) {
    return {
      status: 400
    };
  }

  await pagesCollection.updateOne({_id: pageId}, {$set: {[`${type}.${body.key}`]: String(body.value).replaceAll("\r", "")}}, {upsert: true});

  return {status: 200};
};