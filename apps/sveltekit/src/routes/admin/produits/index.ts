import type { RequestHandler } from "@sveltejs/kit";
import busboy from "busboy";
import { pipeline } from "stream/promises";
import { pictures as picturesCollection, products as productsCollection } from "$lib/db";
import { generateId, streamToBuffer } from "$lib/utils";
import { generatePicture } from "$lib/photo";
import type { Product } from "$lib/db/product";

export const post: RequestHandler = async ({request, locals}) => {
  if (!locals.admin) {
    return {
      status: 403,
      body: {
        message: "Vous devez être admin"
      }
    };
  }

  let buffer: Buffer;

  const fields = {
    name: "",
    description: "",
    price: 100,
    kind: "armchair"
  };

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
      bb.on("field", (name, val) => {
        if (name in fields) {
          fields[name] = val;
        }
      });
    
      await pipeline(request.body as any, bb);  
    } catch (err) {
      reject(err);
    }
  });

  const productId = generateId(fields.name);
  
  await generatePicture(buffer, fields.name, {productId, cb: async (session) => {
    await productsCollection.insertOne({
      _id: productId,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: fields.description,
      kind: fields.kind,
      name: fields.name,
      price: +fields.price,
      state: "draft",
    } as Product, {session});
  }});

  return {
    status: 200,
  };
};

export const get: RequestHandler = async ({locals}) => {
  if (!locals.admin) {
    return {
      status: 403,
      body: {
        message: "Vous devez être admin"
      }
    };
  }

  const products = await productsCollection.find({}).toArray();
  const pictures = await picturesCollection.find({productId: {$in: products.map(p => p._id)}}).sort({createdAt: 1}).toArray();

  const byId = Object.fromEntries(products.map(p => [p._id, p]));

  for (const picture of pictures) {
    byId[picture.productId].photos = [... (byId[picture.productId].photos || []), picture];
  }

  console.log(JSON.stringify(products));

  return {
    body: {
      products
    }
  };
};