import type { EndpointOutput, RequestEvent } from "@sveltejs/kit";

export async function post({request}: RequestEvent): Promise<EndpointOutput> {
  return {status: 201};
}