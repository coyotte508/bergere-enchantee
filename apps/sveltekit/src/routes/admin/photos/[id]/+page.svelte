<script lang="ts">
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  import type { Picture } from "$lib/db/picture";
  import PictureComponent from "$lib/components/Picture.svelte";

  export let photo: Picture;
</script>

<div flex flex-col items-center>
  <form method="post">
    <input type="text" name="name" input value="{photo.name}">
    <input type="submit" hidden>
  </form>
  <PictureComponent picture={photo} class="mt-2" style="max-width: 100%; max-height: 500px"/>
  <form method="post" action="/admin/photos/{photo._id}?_method=delete">
    <input type="submit" value="Supprimer" mt-2>
  </form>
</div>
