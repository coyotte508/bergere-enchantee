import { pages } from "$lib/db/page";
import type { RequestEvent, ShadowEndpointOutput } from "@sveltejs/kit/types/internal";

export function get(event: RequestEvent): ShadowEndpointOutput {
  const pageId = decodeURIComponent(event.params.id);

  return {
    body: JSON.stringify(pages[pageId])
  };
}