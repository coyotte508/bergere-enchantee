import type { EndpointOutput, RequestEvent } from "@sveltejs/kit";

export async function post(event: RequestEvent): Promise<EndpointOutput> {
  return {
    status: 303,
    headers: {
      location: "/",
      "Set-Cookie": "bergereToken=null; Max-Age=0; Path=/; SameSite=Lax; Secure"
    }
  };
}