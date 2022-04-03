<script lang="ts">
  import PictureComponent from "$lib/components/Picture.svelte";
  import type { Product } from "$lib/db/product";

  export let products: Product[];
</script>

<a href="/admin/produits/nouveau" link>Nouveau produit</a>

<h1 text-sunray mt-10>Liste des produits</h1>

<div flex flex-row flex-wrap gap-6 mt-6>
{#each products as product}
  <div flex flex-col text-center>
    <a href="/admin/produits/{product._id}" flex flex-col items-center>
      <PictureComponent picture={product.photos[0]} class="h-36 block" style="object-fit: scale-down;"/>
      <span mt-2>{product.name}</span>
    </a>
  </div>
{/each}
</div>