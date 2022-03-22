import { users } from "$lib/db";
import { extractCookie } from "$lib/extractCookie";
import type { Handle, RequestEvent } from "@sveltejs/kit";
import type { Session } from "./global";

/// We redirect POST requests not to /api, to /api. Then we redirect them back to not /api (with the error message as query parameter if present)
export const handle: Handle = async({ event, resolve }) => {
  await getSession(event); // fill in locals

  if (event.request.method === "POST" && !event.url.pathname.startsWith("/api/")) {
    const url = new URL(event.url);
    url.pathname = "/api" + url.pathname;
    url.searchParams.set("html", "1");
    return new Response(null, {status: 307, headers: {location: url.href}});
  }

  if (event.url.pathname.startsWith("/api/")) {
    const result = await resolve(event);

    if (event.url.searchParams.get("html") !== "1") {
      return result;
    }

    const url = new URL(event.url);
    url.searchParams.delete("html");
    url.pathname = url.pathname.slice("/api".length);

    if (!result.ok) {
      url.searchParams.set("error", 
        result.headers.get("content-type").includes("application/json") ? 
        (await result.json()).message : 
        await result.text()
      );
    }
    
    return new Response(null, {status: 303, headers: {location: url.href}});
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
