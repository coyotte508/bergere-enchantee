import { connectPromise, users } from "$lib/db";
import { extractCookie } from "$lib/extractCookie";
import type { GetSession, Handle } from "@sveltejs/kit";

export const handle: Handle = async({ event, resolve }) => {
  console.log(event.request.method, event.url.href);
  await connectPromise;

  await getSession(event); // fill in locals

  const result = await resolve(event);
  event.url.searchParams.delete("_method");

  const isXhr = event.request.headers.get("accept") === "application/json" 
    || event.request.headers.get("content-type") === "application/json" 
    || event.request.headers.get("X-Requested-With") !== "XMLHttpRequest";

  if (!isXhr && (event.request.method === "POST" || event.request.method === "DELETE")) {
    if (!result.ok) {
      event.url.searchParams.set("error", 
        result.headers.get("content-type").includes("application/json") ? 
        (await result.json()).message : 
        await result.text()
      );
      return new Response(null, {status: 303, headers: {location: event.url.href}});
    }

    if (event.request.method === "DELETE") {
      event.url.pathname = event.url.pathname.slice(0, event.url.pathname.lastIndexOf("/"));
    }

    console.log("redirect too", event.url.pathname, event.url.href);

    return new Response(null, {status: 303, headers: {location: event.url.href}});
  }

  return result;
};

export const getSession: GetSession = async (event) => {
  const bergereToken = extractCookie("bergereToken", event.request.headers.get("cookie") ?? "");

  const origin = `http://${event.request.headers.get("Host")}`;

  if (bergereToken) {
    const user = await users.findOne({token: bergereToken}, {projection: {email: 1, authority: 1}});

    if (user) {
      event.locals.user = user;
      event.locals.admin = user.authority === "admin";
      return {
        user: JSON.parse(JSON.stringify(user)), 
        origin
      };
    }
  }

  return { origin };
};
