import { pictures } from "$lib/db";
import type { EndpointOutput, RequestEvent } from "@sveltejs/kit";

export async function get({locals}: RequestEvent): Promise<EndpointOutput> {
  if (!locals.admin) {
    return {
      status: 403,
      body: {
        message: "Vous devez être admin"
      }
    };
  }

  return {
    body: JSON.stringify(await pictures.find({}).toArray())
  };
}