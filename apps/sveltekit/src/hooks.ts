import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async({ event, resolve }) => {
  const originalPathname = event.url.pathname;
  if (event.request.method === "POST" && !event.url.pathname.startsWith("/api/")) {
    event.url.pathname = `/api${event.url.pathname}`;
    const result = await resolve(event);

    if (result.status >= 400) {
      event.url.pathname = originalPathname;
      event.url.searchParams.set("error", 
        result.headers.get("content-type").includes("application/json") ? 
        (await result.json()).message : 
        await result.text()
      );
      const result2 = await resolve({...event, request: {...event.request, method: "GET"}});
      return new Response(result2.body, {status: result.status});
    }

    return result;
  }

  return await resolve(event);
};
