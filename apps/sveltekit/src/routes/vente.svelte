<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import Picture from "$lib/components/Picture.svelte";
  import Masonry from "$lib/components/Masonry.svelte";
  import type { Product } from "$lib/db/product";

  export let published: Product[];
  // export let retired: Product[];
</script>

<Container>
  <h1 text-4xl text-oxford my-4>Produits à la vente</h1>

  <Masonry>
    {#each published as product}
      <a href="/vente/{product._id}" class="product">
        <Picture picture={product.photos[0]} class="picture"></Picture>
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