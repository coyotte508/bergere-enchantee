import { redirect } from '@sveltejs/kit';
import type { LoadInput, LoadOutput } from "@sveltejs/kit";

throw new Error("@migration task: Check if you need to migrate the load function input (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693)");
export function load(input: LoadInput): PageLoadOutput {
  throw redirect(302, "/admin/pages");
}
