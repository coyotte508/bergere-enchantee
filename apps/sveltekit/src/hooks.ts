import { users } from "$lib/db";
import { extractCookie } from "$lib/extractCookie";
import type { GetSession, Handle, RequestEvent } from "@sveltejs/kit";
import type { Session } from "./global";

export const handle: Handle = async({ event, resolve }) => {
  await getSession(event); // fill in locals

  const result = await resolve(event);

  if (event.request.headers.get("X-Requested-With") !== "XMLHttpRequest" && event.request.method === "POST") {
    // This is a normal POST, not a programmatic one

    if (!result.ok) {
      event.url.searchParams.set("error", 
        result.headers.get("content-type").includes("application/json") ? 
        (await result.json()).message : 
        await result.text()
      );
    }
    return new Response(null, {status: 303, headers: {location: event.url.href}});
  }

  return result;
};

export const getSession: GetSession = async (event) => {
  const bergereToken = extractCookie("bergereToken", event.request.headers.get("cookie") ?? "");

  if (bergereToken) {
    const user = await users.findOne({token: bergereToken}, {projection: {email: 1, authority: 1}});
    event.locals.user = user;
    event.locals.admin = user.authority === "admin";
    return {user: JSON.parse(JSON.stringify(user))};
  }

  return {};
};
