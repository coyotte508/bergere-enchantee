import { connectPromise, users } from "$lib/db";
import { extractCookie } from "$lib/extractCookie";
import type { GetSession, Handle } from "@sveltejs/kit";

export const handle: Handle = async({ event, resolve }) => {
  console.log(event.request.method, event.url.href);
  await connectPromise;

  await getSession(event); // fill in locals

  const result = await resolve(event);

  const isXhr = event.request.headers.get("accept") === "application/json" || event.request.headers.get("X-Requested-With") !== "XMLHttpRequest";
  if (isXhr && (event.request.method === "POST" || event.request.method === "DELETE")) {
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
