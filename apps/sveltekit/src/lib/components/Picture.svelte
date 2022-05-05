<script lang="ts">
  import type { Picture } from "$lib/db/picture";

  export let picture: Picture;
  export let minStorage = 0;
</script>

{#if picture}
  <img alt="{picture.name}" srcset="{picture.storage.slice(minStorage).map(format => `/photos/raw/${format._id} ${format.width}w`).join(", ")}" {...$$restProps} on:click on:load>
{/if}