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
  import Container from "$lib/components/Container.svelte";
  import Carousel from "$lib/components/Carousel.svelte";

  export let pageData: HomePage;
  export let pictures: Picture[];

  const showcasePics = Object.keys(pageData.pictures)
    .filter(key => key.startsWith("realisation-") && pageData.pictures[key])
    .map(key => pictures.find(pic => pic._id === pageData.pictures[key]))
    .filter(Boolean);
</script>

<Container>  
  <section relative class="h-xl" mt-12>
    <img src="/triangles.svg" alt="Triangles" pointer-events-none select-none absolute class="h-5/6" style="left: 38%; top: 50%; transform: translate(-50%, -50%)">
    <PictureComponent picture={pictures.find(p => p._id === pageData.pictures.discover)} sizes="(max-width: 1200px) 50vw, 600px" class="absolute top-0 bottom-0 rounded-3xl right-0 w-3/6 h-full object-cover" />
    <h2 absolute text-oxford text-7xl style="left: 0; top: 50%; transform: translate(0, -50%)">Découvrez <br> nos fauteuils</h2>
    <a href="/realisations" text-white bg-oxford px-4 py-2 rounded-3xl font-bold absolute style="left: 25%; top: 75%; transform: translate(-50%, -50%)">cliquez ici</a>
  </section>
  
  <section class="h-sm" mt-16 flex mb-16>
    <div grow basis-0 h-full>
      <div pr-12 h-full>
        <div w-full h-full relative>
          <div rounded-3xl w-full h-full bg-sunray absolute left-4 top-4 style="z-index: -1"></div>
          <PictureComponent picture={pictures.find(p => p._id === pageData.pictures.move)} sizes="(max-width: 1024px) 50vw, 512px" class="rounded-3xl w-full h-full object-cover" />
        </div>
      </div>
    </div>
    <div grow basis-0 flex flex-col relative>
      <h2 text-oxford text-4xl mt-6>Je me déplace dans le <span text-sunray>Finistère</span> sur rendez-vous.</h2>
      <a href="/contact" text-white bg-oxford px-4 py-2 rounded-3xl font-bold absolute bottom-0 right-0>en savoir plus</a>
    </div>
  </section>
  
  <section style="text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);">
    {@html marked(pageData.text["presentation"])}
  </section>
</Container>

<section bg-oxford my-12 py-12 w-full text-center flex flex-col items-center>
  <h2 text-4xl text-white>Mes <span text-sunray>réalisations</span></h2>
  <a href="/realisations" text-white bg-sunray px-4 py-2 rounded-3xl font-bold mt-4 >voir plus</a>
  <Carousel class="w-full mt-12 h-2xl">
    {#each showcasePics as pic}
      <div w-full h-full flex items-center justify-around>
        <PictureComponent picture={pic} class="rounded-3xl object-contain" style="max-width: 100%; max-height: 100%" />
      </div>
    {/each}
  </Carousel>
</section>

<Container>
  <section h-xl rounded-3xl bg-oxford overflow-hidden flex mb-12>
    <PictureComponent class="w-2/6 h-full object-cover" picture={pictures.find(p => p._id === pageData.pictures["e-shop"])} />
    <div class="w-4/6 h-full" px-6 py-12 text-white flex flex-col box-border>
      <h2 text-4xl mb-10>Notre <span text-sunray>e-shop</span> n'attend plus que vous</h2>
      {@html marked(pageData.text["eshop-description"])}
      <div mt-auto text-center> 
        <a href="/vente" text-white bg-sunray px-4 py-2 rounded-3xl font-bold>e-shop</a>
      </div>
    </div>
  </section>
</Container>