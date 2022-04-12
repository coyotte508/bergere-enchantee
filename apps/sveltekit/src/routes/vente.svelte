<script context="module" lang="ts">
  export const load: Load = async (input) => {
    const res = await input.fetch("/produits", {headers: {"content-type": "application/json"}});
    if (!res.ok) {
      throw await res.json();
    }
    const {
      published, retired
    } = await res.json();

    return {
      props: {
        pageData: input.stuff.pageData,
        pictures: input.stuff.pictures,
        published,
        retired
      }
    };
  };
</script>


<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import PictureComponent from "$lib/components/Picture.svelte";
  import Masonry from "$lib/components/Masonry.svelte";
  import type { Product } from "$lib/db/product";
  import type { Load } from "@sveltejs/kit";
  import type { Picture } from "$lib/db/picture";
  import type { EshopPage } from "$lib/db/page";
  import { onMount } from "svelte";

  export let published: Product[];
  export let pictures: Picture[];
  export let pageData: EshopPage;
  // export let retired: Product[];

  onMount(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
          behavior: "smooth"
        });
      });
    });
  });
</script>

<div class="h-full-without-banner" w-full relative>
  <PictureComponent picture={pictures.find(p => p._id === pageData.pictures.background)} class="h-full w-full object-cover absolute top-0 bottom-0 left-0 right-0" style="z-index: -1"></PictureComponent>
  <Container class="h-full flex flex-col items-start">
    <div grow basis-0></div>
    <div style="flex-grow: 2" px-8 lg:px-0   basis-0 text-center>
      <h1 text-7xl text-white text-left>Découvrez <br>nos ventes</h1>
      <a href="#produits" text-white bg-oxford px-4 py-2 mt-10 inline-block rounded-3xl font-bold>cliquez ici</a>
    </div>
  </Container>

</div>

<Container>
  <h2 text-4xl text-oxford my-4 id="produits">Produits à la vente</h2>

  <Masonry>
    {#each published as product}
      <a href="/vente/{product._id}" class="product">
        <PictureComponent picture={product.photos[0]} class="picture"></PictureComponent>
        <span class="name">{product.name}</span>
        <span class="price" text-right>{product.price} €</span>
      </a>
    {/each}
  </Masonry>
</Container>

<style>
  .product {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    grid-template-areas: 
      "picture picture"
      "name price";
  }

  :global(.product > .picture) {
    grid-area: picture;
    max-height: 24rem;
    max-width: 100%;
  }

  .product > .name {
    grid-area: name;

    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .product > .price {
    grid-area: price;
  }
</style>