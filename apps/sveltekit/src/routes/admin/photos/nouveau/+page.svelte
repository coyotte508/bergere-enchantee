<script lang="ts">
  import { page } from "$app/stores";

  const productId = $page.url.searchParams.get("productId");
</script>

<h1 text-sunray>Ajouter une photo</h1>

<form method="post" action="/admin/photos" enctype="multipart/form-data">
  <label block my-4 leading-8>
    Nom de la photo
    <input input type="text" name="name" block placeholder="Nom définitif" required>
  </label>

  <label block my-4 leading-8>
    Fichier JPEG
    <input type="file" name="photo" accept="image/jpeg" block required>
  </label>

  {#if productId}
    <p>Produit associé: <a href="/admin/produits/{productId}" link>{productId}</a></p>
  {/if}

  <input type="hidden" name="productId" value="{productId || ''}">

  <input type="submit" hidden>
</form>