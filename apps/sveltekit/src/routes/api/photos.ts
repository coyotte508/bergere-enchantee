import { pictures } from "$lib/db";
import type { EndpointOutput, RequestEvent } from "@sveltejs/kit";

export async function get({locals, url}: RequestEvent): Promise<EndpointOutput> {
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
    body: JSON.stringify(await pictures.find(ids ? {_id: {$in: ids.split(",")}}: {}).toArray())
  };
}