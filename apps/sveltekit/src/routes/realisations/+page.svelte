<script lang="ts">
  import { page } from "$app/stores";

  import Container from "$lib/components/Container.svelte";
  import PictureComponent from "$lib/components/Picture.svelte";
  import type { CreationsPage } from "$lib/db/page";
  import type { Picture } from "$lib/db/picture";
  import { marked } from "marked";

  const pageData: CreationsPage = $page.stuff.pageData;
  const pictures: Picture[]  = $page.stuff.pictures;

  const picKeys = Object.keys(pageData.pictures)
    .filter(key => key.startsWith("realisation-") && pageData.pictures[key]);
</script>

<Container>
  <h1 text-4xl text-oxford mt-4>Nos réalisations</h1>

  {#each picKeys as picKey, i }
    <article class="{ (i%2) ? 'bg-oxford' : 'bg-sunray'}" text-white text-lg md:h-xl mt-16 flex mb-16 flex-wrap md:flex-no-wrap rounded-3xl overflow-hidden>
      <div grow h-full class:md:order-last={i % 2} w-full class="md:w-3/6" basis-auto md:basis-0>
        <PictureComponent picture={pictures.find(p => p._id === pageData.pictures[picKey])} sizes="(max-width: 1024px) 50vw, 512px" class="w-full h-full object-cover" />
      </div>
      <div grow basis-0 flex flex-col relative justify-center>
        <div px-4 py-6>
          {@html marked(pageData.text[picKey])}
          <a href="/photos/raw/{pictures.find(p => p._id === pageData.pictures[picKey]).storage[0]._id}" underline target="_blank">Photo entière</a>
        </div>
      </div>
    </article>
  {/each}
</Container>
