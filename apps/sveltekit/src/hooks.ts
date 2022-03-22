import { users } from "$lib/db";
import { extractCookie } from "$lib/extractCookie";
import type { Handle, RequestEvent } from "@sveltejs/kit";
import type { Session } from "./global";

export const handle: Handle = async({ event, resolve }) => {
  console.log(event.request.method, event.url.pathname);
  
  if (event.request.method === "POST" && !event.url.pathname.startsWith("/api/")) {
    const newUrl = new URL(event.url);
    newUrl.pathname = `/api${event.url.pathname}`;
    const result = await fetch(newUrl.href, {method: "POST", headers: event.request.headers, body: event.request.body});

    if (result.status >= 400) {
      event.url.searchParams.set("error", 
        result.headers.get("content-type").includes("application/json") ? 
        (await result.json()).message : 
        await result.text()
      );
      return new Response(null, {status: 303, headers: {location: event.url.href}});
    }

    return result;
  }

  if (event.url.pathname.startsWith("/api/")) {
    await getSession(event); // fill in locals
  }

  return await resolve(event);
};

export async function getSession(event: RequestEvent): Promise<Session> {
  const bergereToken = extractCookie("bergereToken", event.request.headers.get("cookie") ?? "");

  if (bergereToken) {
    const user = await users.findOne({token: bergereToken}, {projection: {email: 1, authority: 1}});
    event.locals.user = user;
    event.locals.admin = user.authority === "admin";
    return {user: JSON.parse(JSON.stringify(user))};
  }

  return {};
}
