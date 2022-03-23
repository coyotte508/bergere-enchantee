<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit";

  export const load: Load = async(input) => {
    if (!input.stuff.user) {
      return { status: 303, redirect: `/connexion?suivant=${encodeURIComponent(input.url.toString())}` };
    }

    if (!input.stuff.admin) {
      return { status: 403};
    }

    return {
      props: {
        url: input.url
      }
    };
  };
</script>

<script lang="ts">
  export let url: URL;
</script>

<div flex justify-evenly mb-10>
  <a href="/admin/pages" pa-2 link class:text-sunray="{url.pathname.startsWith('/admin/pages')}">Pages</a>
  <a href="/admin/photos" pa-2 link class:text-sunray="{url.pathname.startsWith('/admin/photos')}">Photos</a>
</div>

<slot/>