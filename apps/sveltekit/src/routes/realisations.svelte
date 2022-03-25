<script context="module" lang="ts">
  export const load: Load = async (input) => {
    const pageId = input.url.pathname;
    if (pageId.includes("page%25")) {
      // infinite loop
      return;
    }
    const pageFetch = await input.fetch(`/pages/${encodeURIComponent("/")}`);
    const pageData: HomePage | null = pageFetch.ok ? await pageFetch.json() : null;
    let pictures: Picture[] = [];
    if (pageData && Object.values(pageData.pictures ?? {}).filter(Boolean).length !== 0) {
      pictures = await (await input.fetch(`/photos?ids=${Object.values(pageData.pictures).filter(Boolean).join(",")}`, {headers: {accept: "application/json"}})).json();
    }

    return {
      props: {
        pageData,
        pictures
      }
    };  
  };
</script>


<script lang="ts">
  import Carousel from "$lib/components/Carousel.svelte";
  import Container from "$lib/components/Container.svelte";
  import PictureComponent from "$lib/components/Picture.svelte";
  import type { HomePage } from "$lib/db/page";
  import type { Picture } from "$lib/db/picture";
  import type { Load } from "@sveltejs/kit";

  export let pageData: HomePage;
  export let pictures: Picture[];

  const showcasePics = Object.keys(pageData.pictures)
    .filter(key => key.startsWith("realisation-") && pageData.pictures[key])
    .map(key => pictures.find(pic => pic._id === pageData.pictures[key]))
    .filter(Boolean);
</script>

<Container>
  <h1 text-4xl text-oxford>🚧 Cette page est en cours de construction</h1>
</Container>

<Carousel class="w-full my-12 h-2xl">
  {#each showcasePics as pic}
    <div w-full h-full flex items-center justify-around>
      <PictureComponent picture={pic} class="rounded-3xl object-contain" style="max-width: 100%; max-height: 100%" />
    </div>
  {/each}
</Carousel>