import type { LayoutLoad } from "@sveltejs/kit";
import type { User } from "$lib/db/user";

throw new Error("@migration task: Check if you need to migrate the load function input (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693)");
export const load: LayoutLoad = async (input) => {
  const pageId = input.url.pathname;
  if (pageId.includes("page%25")) {
    // infinite loop
    return;
  }
  const pageFetch = await input.fetch(`/pages/${encodeURIComponent(pageId)}`);
  const pageData: Page | null = pageFetch.ok ? await pageFetch.json() : null;
  let pictures: Picture[] = [];
  if (pageData && Object.values(pageData.pictures ?? {}).filter(Boolean).length !== 0) {
    pictures = await (await input.fetch(`/photos?ids=${Object.values(pageData.pictures).filter(Boolean).join(",")}`, {headers: {accept: "application/json"}})).json();
  }

  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693)");
  return {
    stuff: {
      user: input.session.user,
      admin: input.session.user?.authority === "admin",
      pageData,
      pictures,
    },
    props: {
      user: input.session.user,
      origin: input.session.origin,
    }
  };  
};
