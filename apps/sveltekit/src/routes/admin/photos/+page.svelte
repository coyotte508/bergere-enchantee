<script lang="ts">
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  import type { Picture } from "$lib/db/picture";
  import PictureComponent from "$lib/components/Picture.svelte";

  export let photos: Picture[];
</script>

<h1 text-sunray>Liste des photos</h1>

<a href="/admin/photos/nouveau" my-4 block link>Nouvelle photo</a>

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