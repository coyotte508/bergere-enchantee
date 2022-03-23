<script lang="ts">
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
