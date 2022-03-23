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

<div relative class="h-xl" mt-12>
  <img src="/triangles.svg" alt="Triangles" pointer-events-none select-none absolute class="h-5/6" style="left: 38%; top: 50%; transform: translate(-50%, -50%)">
  <PictureComponent picture={pictures.find(p => p._id === pageData.pictures.discover)} sizes="(max-width: 1200px) 50vw, 600px" class="absolute top-0 bottom-0 rounded-3xl right-0 w-3/6 h-full cover" />
  <h2 absolute text-oxford text-7xl style="left: 0; top: 50%; transform: translate(0, -50%)">Découvrez <br> nos fauteuils</h2>
  <a href="/realisations" text-white bg-oxford px-4 py-2 rounded-3xl font-bold absolute style="left: 25%; top: 75%; transform: translate(-50%, -50%)">cliquez ici</a>
</div>

<div class="h-sm" mt-16 flex mb-12>
  <div grow basis-0 h-full>
    <div pr-12 h-full>
      <div w-full h-full relative>
        <div rounded-3xl w-full h-full cover bg-sunray absolute left-4 top-4 style="z-index: -1"></div>
        <PictureComponent picture={pictures.find(p => p._id === pageData.pictures.move)} sizes="(max-width: 1024px) 50vw, 512px" class="rounded-3xl w-full h-full cover" />
      </div>
    </div>
  </div>
  <div grow basis-0 flex flex-col relative>
    <h2 text-oxford text-4xl mt-6>Je me déplace dans le <span text-sunray>Finistère</span> sur rendez-vous.</h2>
    <a href="/contact" text-white bg-oxford px-4 py-2 rounded-3xl font-bold absolute bottom-0 right-0>en savoir plus</a>
  </div>
</div>


<div style="text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);">
  {@html marked(pageData.text["presentation"])}
</div>


<style global>
  .brown-shadow::after {
    content: ".";
    background-color: var(--sunray);
    width: 100%;
    height: 100%;
  }

  :global(.brown-shadow)::after {
    content: ".";
    background-color: var(--sunray);
    width: 100%;
    height: 100%;
  }

  :global(.brown-shadow::after) {
    content: ".";
    background-color: var(--sunray);
    width: 100%;
    height: 100%;
  }
</style>