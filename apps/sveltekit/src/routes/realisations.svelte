<script context="module" lang="ts">
  export const load: Load = async (input) => {
    return {
      props: {
        pageData: input.stuff.pageData,
        pictures: input.stuff.pictures
      }
    };  
  };
</script>


<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import PictureComponent from "$lib/components/Picture.svelte";
  import type { CreationsPages, HomePage } from "$lib/db/page";
  import type { Picture } from "$lib/db/picture";
  import type { Load } from "@sveltejs/kit";
  import { marked } from "marked";

  export let pageData: CreationsPages;
  export let pictures: Picture[];

  const picKeys = Object.keys(pageData.pictures)
    .filter(key => key.startsWith("realisation-") && pageData.pictures[key]);

  const showcasePics = Object.keys(pageData.pictures)
    .filter(key => key.startsWith("realisation-") && pageData.pictures[key])
    .map(key => pictures.find(pic => pic._id === pageData.pictures[key]))
    .filter(Boolean);
</script>

<Container>
  <h1 text-4xl text-oxford mt-4>Nos réalisations</h1>

  {#each picKeys as picKey, i }
    <article class="{ (i%2) ? 'bg-oxford' : 'bg-sunray'}" md:bg-transparent text-white md:text-black md:h-md mt-16 flex mb-16 flex-wrap md:flex-no-wrap rounded-3xl overflow-hidden md:overflow-visible>
      <div grow h-full class:md:order-last={i % 2} w-full md:w-auto basis-auto md:basis-0>
        <div md:pr-12 md:h-full h-md>
          <div w-full h-full relative>
            <div hidden md:block absolute rounded-3xl w-full h-full class="{ (i%2) ? 'bg-brunswick' : 'bg-sunray'}" left-4 top-4 style="z-index: -1"></div>
            <PictureComponent picture={pictures.find(p => p._id === pageData.pictures[picKey])} sizes="(max-width: 1024px) 50vw, 512px" class="md:rounded-3xl w-full h-full object-cover" />
          </div>
        </div>
      </div>
      <div grow basis-0 flex flex-col relative px-4 py-6 style="text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);">
        {@html marked(pageData.text[picKey])}
      </div>
    </article>
  {/each}
</Container>
