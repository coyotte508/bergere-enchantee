import type { RequestHandler } from "@sveltejs/kit";
import { pictures } from "$lib/db";

export const get: RequestHandler = async ({url}) => {
  const ids = url.searchParams.get("ids") as string;

  if (!ids) {
    return {
      status: 403,
      body: {
        message: "Vous devez spécifier les ids"
      }
    };
  }

  return {
    body: await pictures.find(ids ? {_id: {$in: ids.split(",")}}: {}).toArray()
  };
};