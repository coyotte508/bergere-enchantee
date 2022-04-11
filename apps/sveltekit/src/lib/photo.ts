import sharp from "sharp";
import { client, Pictures, PicturesFs } from "$lib/db";
import { generateId } from "$lib/utils";
import type { ClientSession } from "mongodb";

export async function generatePicture(buffer: Buffer, name: string, opts?: {productId?: string, cb?: (session: ClientSession) => Promise<void>}): Promise<void> {
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

  const _id = generateId(name);

  await client.withSession(async (session) => {
    await Pictures.insertOne({
      _id,
      name,
      storage: formats.map(format => ({
        _id: `${_id}-${format.width}x${format.height}`,
        width: format.width,
        height: format.height,
        size: format.data.length
      })),
      ... (opts?.productId && {productId: opts.productId}),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {session});
    
    await PicturesFs.insertMany(formats.map(format => ({
      _id: `${_id}-${format.width}x${format.height}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      size: format.data.length,
      data: format.data,
      picture: _id
    }), {session}));

    if (opts?.cb) {
      await opts.cb(session);
    }
  });
}