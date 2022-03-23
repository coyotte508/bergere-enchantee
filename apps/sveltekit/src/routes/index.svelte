<script context="module" lang="ts">
  export const load: Load = (input) => {
    return {
      props: {
        pageData: input.stuff.pageData,
        pictures: input.stuff.pictures
      }
    };
  };
</script>

<script lang="ts">
  import type { HomePage } from "$lib/db/page";
  import PictureComponent from "$lib/components/Picture.svelte";
  import type { Load } from "@sveltejs/kit";
  import { marked } from "marked";
  import type { Picture } from "$lib/db/picture";

  export let pageData: HomePage;
  export let pictures: Picture[];
</script>

<div relative class="h-xl">
  <img src="/triangles.svg" alt="Triangles" pointer-events-none select-none absolute class="h-5/6" style="left: 38%; top: 50%; transform: translate(-50%, -50%)">
  <PictureComponent picture={pictures.find(p => p._id === pageData.pictures.discover)} class="absolute top-0 bottom-0 rounded-3xl right-0 w-3/6" style="object-fit: cover; height: 100%" />
  <h2 absolute text-oxford text-7xl style="left: 0; top: 50%; transform: translate(0, -50%)">Découvrez <br> nos fauteuils</h2>
  <a href="/realisations" text-white bg-oxford px-4 py-2 rounded-3xl font-bold absolute style="left: 25%; top: 75%; transform: translate(-50%, -50%)">cliquez ici</a>
</div>


{@html marked(pageData.text["presentation"])}
