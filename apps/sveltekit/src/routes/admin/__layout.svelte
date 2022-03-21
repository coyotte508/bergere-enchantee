<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";
  import type { StringDict } from "src/global";
  import type { Stuff } from "../__layout.svelte";

  export function load(input: LoadInput<StringDict, Stuff>): LoadOutput {
    if (!input.stuff.user) {
      return { status: 303, redirect: `/connexion?suivant=${encodeURIComponent(input.url.toString())}` };
    }

    if (!input.stuff.admin) {
      return { status: 403};
    }

    return {
    };
  }
</script>

<div flex justify-evenly mb-10>
  <a href="/admin/pages" link>Pages</a>
  <a href="/admin/photos" link>Photos</a>
</div>

<slot/>