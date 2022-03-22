import { picturesFs } from "$lib/db";
import type { EndpointOutput, RequestEvent } from "@sveltejs/kit";

export async function get({params}: RequestEvent): Promise<EndpointOutput> {
  const fs = await picturesFs.findOne({_id: params.id});
  return {
    headers: {
      "Content-Type": "image/webp"
    },
    body: new Uint8Array(fs.data.buffer, 0, fs.data.buffer.byteLength)
  };
}