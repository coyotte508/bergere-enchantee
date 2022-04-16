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
      product
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

  function submit() {
    alert("Cette partie de l'e-shop n'est pas encore implémentée. Veuillez prendre contact par mail, téléphone ou instagram.");
  }
</script>

<Container>
  <article flex my-16>
    <div grow basis-0>
      <a href="/photos/raw/{product.photos[0].storage[0]._id}" target="_blank">
        <PictureComponent picture={product.photos[0]} title="Cliquez pour voir la photo entière" class="w-full"></PictureComponent>
      </a>
    </div>
    <div grow basis-0 px-8>
      <h1 text-oxford text-4xl>{product.name}</h1>

      <div mt-4 flex items-center><span font-bold text-2xl mr-2>{product.price} €</span> (+ livraison hors Finistère)</div>
      <div class="marked leading-6">
        {@html marked(product.description)}
      </div>

      <form action="post">
        <button type="submit" on:click|preventDefault={submit} mt-4 text-xl leading-6 py-3 px-6 bg-oxford border-0 shadow text-white rounded-md cursor-pointer>Acheter</button>
      </form>
    </div>
  </article>
</Container>