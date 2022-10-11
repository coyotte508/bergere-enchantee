<script lang="ts">
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  import PictureComponent from "$lib/components/Picture.svelte";
  import type { Product } from "$lib/db/product";

  export let product: Product;
</script>

<h1 text-sunray>Modifier un produit</h1>

<div flex flex-col  >
  <form method="post">
    <label block w-full mt-4 leading-8>
      Nom
      <input type="text" name="name" input value="{product.name}" block>
    </label>
    <label block w-full mt-4 leading-8>
      Prix
      <input type="text" name="price" input value="{product.price}" block>
    </label>
    <label block w-full mt-4 leading-8>
      Etat
      <select name="state" value={product.state} block>
        <option value="draft">Privé</option>
        <option value="published">Public</option>
        <option value="retired">Vendu</option>
      </select>
    </label>
    <label block w-full mt-4 leading-8>
      Type

      <select name="kind" value={product.kind} block>
        <option value="armchair">Fauteuil</option>
        <option value="chair">Chaise</option>
        <option value="couch">Canapé</option>
        <option value="cushion">Coussin</option>
        <option value="tufting">Tufting</option>
      </select>
    </label>

    <label block my-4 w-full>
      Description
      <textarea name="description" cols="30" rows="10" block w-full>{product.description}</textarea>
    </label>

    <button type="submit" mt-4 leading-6 py-0 px-3 bg-oxford border-0 shadow text-white rounded-md cursor-pointer>Valider</button>
  </form>
</div>

<h2 text-sunray my-4>Photos</h2>

<a href="/admin/photos/nouveau?productId={product._id}" link>Nouvelle photo</a>

<div flex flex-row flex-wrap gap-6 mt-6>
  {#each product.photos as photo}
    <div flex flex-col text-center>
      <a href="/admin/photos/{photo._id}" flex flex-col items-center>
        <PictureComponent picture={photo} class="h-36 block" style="object-fit: scale-down;"/>
        <span>{photo.name}</span>
      </a>
    </div>
  {/each}
</div>