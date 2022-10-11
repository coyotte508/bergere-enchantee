throw new Error("@migration task: Update +page.server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");

import type { RequestHandler } from "@sveltejs/kit";
import busboy from "busboy";
import { pipeline } from "stream/promises";
import { Pictures } from "$lib/db";
import { streamToBuffer } from "$lib/utils";
import { generatePicture } from "$lib/photo";

export const post: RequestHandler = async ({request}) => {
  let buffer: Buffer;
  let name = "";
  let productId = "";

  // eslint-disable-next-line no-async-promise-executor
  await new Promise<void>(async (resolve, reject) => {
    try {
      const bb = busboy({
        headers: {
          "content-type": request.headers.get("content-type")
        }
      });
      bb.on("file", async (name, file, info) => {
        // const { filename, encoding, mimeType } = info;
        buffer = await streamToBuffer(file);
        resolve();
      });
      bb.on("field", (_name, val) => {

        if (_name === "name") {
          name = val;
        } else if (_name === "productId") {
          productId = val;
        }
      });
    
      await pipeline(request.body as any, bb);  
    } catch (err) {
      reject(err);
    }
  });

  await generatePicture(buffer, name, {productId: productId || undefined});

  return {
    status: productId ? 303 : 200,
    headers: {
      ... (productId && {"location": "/admin/produits/" + productId})
    },
  };
};

export const get: RequestHandler = async () => {
  return {
    body: {
      photos: await Pictures.find({productId: {$exists: false}}).toArray()
    }
  };
};