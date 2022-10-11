import type { EndpointOutput, RequestEvent } from "@sveltejs/kit";

export async function POST(event: RequestEvent): Promise<EndpointOutput> {
  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");
  return {
    status: 303,
    headers: {
      location: "/",
      "Set-Cookie": "bergereToken=null; Max-Age=0; Path=/; SameSite=Lax; Secure"
    }
  };
}