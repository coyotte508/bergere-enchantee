import { redirect } from '@sveltejs/kit';
import type { LoadInput, LoadOutput } from "@sveltejs/kit";
import type { StringDict } from "src/global";
import type { Stuff } from "../__layout.svelte";

throw new Error("@migration task: Check if you need to migrate the load function input (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693)");
export function load(input: LoadInput<StringDict, Stuff>): PageLoadOutput {
  if (!input.stuff.user) {
    throw redirect(303, `/connexion?suivant=${encodeURIComponent(input.url.toString())}`);
  }

  return {
  user: input.stuff.user,
  admin: input.stuff.admin
};
}
