import { picturesFs } from "$lib/db";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async ({params}) => {
  const fs = await picturesFs.findOne({_id: params.id});
  return {
    headers: {
      "Content-Type": "image/webp"
    },
    body: new Uint8Array(fs.data.buffer, 0, fs.data.buffer.byteLength)
  };
};