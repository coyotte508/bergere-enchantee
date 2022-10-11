<script lang="ts">
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

import Container from "$lib/components/Container.svelte";

  export let url: URL;
</script>

<div flex justify-evenly mb-10>
  <a href="/admin/pages" pa-2 link class:text-sunray="{url.pathname.startsWith('/admin/pages')}">Pages</a>
  <a href="/admin/photos" pa-2 link class:text-sunray="{url.pathname.startsWith('/admin/photos')}">Photos</a>
  <a href="/admin/produits" pa-2 link class:text-sunray="{url.pathname.startsWith('/admin/produits')}">Produits</a>
</div>

<Container>  
  <slot/>
</Container>