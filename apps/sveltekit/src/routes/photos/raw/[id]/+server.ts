throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");

import { PicturesFs } from "$lib/db";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async ({params}) => {
  const fs = await PicturesFs.findOne({_id: params.id});
  return {
    headers: {
      "Content-Type": "image/webp"
    },
    body: new Uint8Array(fs.data.buffer, 0, fs.data.buffer.byteLength)
  };
};