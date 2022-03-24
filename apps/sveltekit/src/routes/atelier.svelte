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
  import type { WorkshopPage } from "$lib/db/page";
  import type { Load } from "@sveltejs/kit";
  import Container from "$lib/components/Container.svelte";
  import type { Picture } from "$lib/db/picture";
  import PictureComponent from "$lib/components/Picture.svelte";
  import { marked } from "marked";

  export let pageData: WorkshopPage;
  export let pictures: Picture[];
</script>

<Container>
  <section relative class="h-xl" mt-12 flex>
    <img src="/triangles.svg" alt="Triangles" pointer-events-none select-none absolute class="h-5/6" style="left: 38%; top: 50%; transform: translate(-50%, -50%); z-index: -1">
    <div class="w-3/6" h-full flex flex-col justify-evenly>
      <h2 text-oxford text-7xl style="mix-blend-mode: color-burn;">L'atelier</h2>
      <ul text-oxford>
        <li flex items-center><div class="i-il-pin" inline-block mr-2 /> <div inline-block>39 route de l'Argoat, <br>29460 Logonna Daoulas</div></li>
        <li flex items-center mt-1><div class="i-ant-design-inbox-outlined" inline-block mr-2 />(dépôt et retrait uniquement)</li>
      </ul>
    </div>
    <PictureComponent picture={pictures.find(p => p._id === pageData.pictures["photo-1"])} sizes="(max-width: 1200px) 50vw, 600px" grow basis-0 class="rounded-3xl h-full object-cover w-3/6" />
  </section>

  <section class="h-sm" mt-16 flex mb-16>
    <div grow basis-0 h-full>
      <div pr-12 h-full>
        <div w-full h-full relative>
          <div rounded-3xl w-full h-full bg-sunray absolute left-4 top-4 style="z-index: -1"></div>
          <PictureComponent picture={pictures.find(p => p._id === pageData.pictures["photo-2"])} sizes="(max-width: 1024px) 50vw, 512px" class="rounded-3xl w-full h-full object-cover" />
        </div>
      </div>
    </div>
    <div grow basis-0 flex flex-col relative>
      <h2 text-oxford text-4xl mt-6>L'atelier, mon endroit de <span text-sunray>création</span></h2>
      <div grow flex flex-col justify-center>
        {@html marked(pageData.text["texte-1"])}
      </div>
    </div>
  </section>
</Container>

<section my-12 w-full text-center flex flex-col items-center>
  <h2 text-4xl text-oxford mb-12><span text-sunray>Mon</span> atelier</h2>
  <PictureComponent picture={pictures.find(p => p._id === pageData.pictures["photo-3"])} class="h-lg w-full object-cover"/>
</section>

<Container>
  {@html marked(pageData.text["texte-2"])}

  <div my-12 mb-20 text-center> 
    <a href="/vente" text-white bg-sunray px-4 py-2 rounded-3xl font-bold>e-shop</a>
  </div>
</Container>