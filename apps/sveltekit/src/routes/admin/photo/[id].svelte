<script lang="ts">
  import type { Picture } from "$lib/db/picture";

  export let photo: Picture;
</script>

<div text-center>
  <span block>{photo.name}</span>
  <img mt-2 src="/photo/raw/{photo.storage[0]._id}" alt="{photo.name}" style="max-width: 100%; max-height: 500px"> 
  <form method="delete">
    <input type="submit" value="Supprimer">
  </form>
</div>
