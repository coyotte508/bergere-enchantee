import type { RequestHandler } from "@sveltejs/kit";
import busboy from "busboy";
import { pipeline } from "stream/promises";
import { nanoid } from "nanoid";
import { kebabCase } from "lodash";
import sharp from "sharp";
import type { Readable } from "stream";
import { client, pictures, picturesFs } from "$lib/db";


/**
 * Reads a binary stream in memory and store it in a buffer
 * 
 * @param stream The readable stream to read
 * @returns {Buffer}
 */
 async function streamToBuffer(stream: Readable): Promise<Buffer> {
	const chunks: Buffer[] = [];
	for await (const chunk of stream) {
		chunks.push(chunk);
	}

  return Buffer.concat(chunks);
}

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
  let name: string;

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
        }
      });
    
      await pipeline(request.body as any, bb);  
    } catch (err) {
      reject(err);
    }
  });
	
  const image = sharp(buffer);
  const {width, height} = await image.metadata();

  const formats: Array<{width: number, height: number, data: Buffer}> = [];

  if (width <= 2048 && height <= 2048) {
    formats.push({
      width,
      height,
      data: await image.toFormat("webp").toBuffer()
    });
  }

  for (const size of [2048, 1024, 512]) {
    if (width > size || height > size) {
      const buffer = await image.resize(width > height ? {width: size} : {height: size}).toFormat("webp").toBuffer();
      const metadata = await sharp(buffer).metadata();

      formats.push({
        width: metadata.width,
        height: metadata.height,
        data: buffer
      });
    }
  }

  const _id = kebabCase(name.replace(/&/g,"-and-")) + "-" + nanoid(6);

  await client.withSession(async (session) => {
    await pictures.insertOne({
      _id,
      name,
      storage: formats.map(format => ({
        _id: `${_id}-${format.width}x${format.height}`,
        width: format.width,
        height: format.height,
        size: format.data.length
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {session});
    
    await picturesFs.insertMany(formats.map(format => ({
      _id: `${_id}-${format.width}x${format.height}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      size: format.data.length,
      data: format.data,
      picture: _id
    }), {session}));
  });

  return {
    status: 200,
  };
};

export const get: RequestHandler = async ({locals, url}) => {
  const ids = url.searchParams.get("ids") as string;

  if (!locals.admin && !ids) {
    return {
      status: 403,
      body: {
        message: "Vous devez être admin"
      }
    };
  }

  return {
    body: await pictures.find(ids ? {_id: {$in: ids.split(",")}}: {}).toArray()
  };
};