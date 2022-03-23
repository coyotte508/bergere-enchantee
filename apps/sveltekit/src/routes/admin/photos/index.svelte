<script lang="ts">
  import type { Picture } from "$lib/db/picture";
  import PictureComponent from "$lib/components/Picture.svelte";

  export let photos: Picture[];
</script>

<h1 text-sunray>Ajouter une photo</h1>

<form method="post" enctype="multipart/form-data">
  <label block my-4 leading-8>
    Nom de la photo
    <input input type="text" name="name" block placeholder="Nom définitif" required>
  </label>

  <label block my-4 leading-8>
    Fichier JPEG
    <input type="file" name="photo" accept="image/jpeg" block required>
  </label>

  <input type="submit" hidden>
</form>

<h1 text-sunray>Liste des photos</h1>

<div flex flex-row flex-wrap gap-6 mt-6>
{#each photos as photo}
  <div flex flex-col text-center>
    <a href="/admin/photos/{photo._id}" flex flex-col items-center>
      <PictureComponent picture={photo} class="h-36 block" style="object-fit: scale-down;"/>
      <span>{photo.name}</span>
    </a>
  </div>
{/each}
</div>