import { prerendering } from "$app/env";
import { connectPromise, users } from "$lib/db";
import { extractCookie } from "$lib/extractCookie";
import type { GetSession, Handle } from "@sveltejs/kit";

function transformHtml(html: string): string {
  return html
    .replace(/<meta (property|name)="(og:|twitter:|)description" content="[^"]+"/g, str => str.replace(/\\n/g, "\n"));
}

export const handle: Handle = async({ event, resolve }) => {
  await connectPromise;

  await getSession(event); // fill in locals

  if (event.url.pathname.startsWith("/admin") && !event.locals.admin && !prerendering) {
    return new Response(JSON.stringify({message: "Vous devez être admin"}), {status: 403, headers: {"content-type": "application/json"}});
  }

  // The replace is for meta:description tag not handled properly by sveltekit
  const result = await resolve(event, {transformPage: ({html}) => transformHtml(html)});
  event.url.searchParams.delete("_method");

  const isXhr = event.request.headers.get("accept") === "application/json" 
    || event.request.headers.get("content-type") === "application/json" 
    || event.request.headers.get("X-Requested-With") === "XMLHttpRequest";

  if (!isXhr && (event.request.method === "POST" || event.request.method === "DELETE") && (result.status < 300 || result.status >= 400)) {
    if (!result.ok) {
      event.url.searchParams.set("error", 
        result.headers.get("content-type")?.includes("application/json") ? 
        (await result.json()).message : 
        "Une erreur s'est produite"
      );
      return new Response(null, {status: 303, headers: {location: event.url.href}});
    }

    if (event.request.method === "DELETE" || event.url.searchParams.get("_method") === "delete") {
      event.url.pathname = event.url.pathname.slice(0, event.url.pathname.lastIndexOf("/"));
    }

    return new Response(null, {status: 303, headers: {location: result.headers.get("location") || event.url.href}});
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
