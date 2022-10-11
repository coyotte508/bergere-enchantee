import { redirect, error } from '@sveltejs/kit';
import type { LayoutLoad } from "@sveltejs/kit";

throw new Error("@migration task: Check if you need to migrate the load function input (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693)");
export const load: LayoutLoad = async(input) => {
  if (!input.stuff.user) {
    throw redirect(303, `/connexion?suivant=${encodeURIComponent(input.url.toString())}`);
  }

  if (!input.stuff.admin) {
    throw error(403);
  }

  return {
  url: input.url
};
};
