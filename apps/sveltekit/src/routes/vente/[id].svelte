<script lang="ts" context="module">
import type { LoadOutput } from "@sveltejs/kit/types/internal";

import type { LoadInput } from "@sveltejs/kit/types/internal";

export async function load(input: LoadInput): Promise<LoadOutput> {
  const res = await input.fetch("/produits/" + input.params.id);

  if (!res.ok) {
    return {status: res.status};
  }

  const {product} = await res.json();

  return {
    props: {
      product,
    },
    stuff: {
      ...input.stuff,
      title: `${product.name} - ${product.price} €`,
      description: product.description,
      pictures: product.photos,
      type: "og:product",
      price: product.price,
    }
  };
}

</script>

<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import PictureComponent from "$lib/components/Picture.svelte";
  import type { Product } from "$lib/db/product";
  import { marked } from "marked";

  export let product: Product;
  let photoIndex = 0;

  function submit() {
    alert("Cette partie de l'e-shop n'est pas encore implémentée. Veuillez prendre contact par mail (contact@bergereenchantee.fr), téléphone (07 74 52 11 15) ou instagram.");
  }
</script>

<Container>
  <article flex my-8 lg:my-16 flex-wrap lg:flex-nowrap>
    <div grow lg:basis-0 justify-center items-center flex flex-col>
      <a href="/photos/raw/{product.photos[photoIndex].storage[0]._id}" target="_blank">
        <PictureComponent picture={product.photos[photoIndex]} title="Cliquez pour voir la photo entière" class="max-w-full max-h-md lg:max-h-xl rounded-3xl"></PictureComponent>
      </a>
      {#if product.photos.length > 1}
        <div flex style="gap: 0.5rem" justify-start w-full ml-8 mt-2>
          {#each product.photos as photo, i}
            <PictureComponent picture={photo} style="border-color: #865716" class="w-16 h-16 object-cover cursor-pointer box-border {i === photoIndex ? 'border border-4' : ''} rounded-md" on:click={() => photoIndex = i}></PictureComponent>
          {/each}
        </div>
      {/if}
    </div>
    <div grow lg:basis-0 lg:px-8 mt-6 lg:m-t0>
      <h1 text-oxford text-4xl>{product.name}</h1>

      <div mt-4 flex items-center><span font-bold text-2xl mr-2>{product.price} €</span> (+ frais de livraison hors Finistère)</div>
      <div class="marked leading-6">
        {@html marked(product.description)}
      </div>

      <form action="post">
        <button type="submit" on:click|preventDefault={submit} mt-4 text-xl leading-6 py-3 px-6 bg-oxford border-0 shadow text-white rounded-md cursor-pointer>Acheter</button>
      </form>
    </div>
  </article>
</Container>