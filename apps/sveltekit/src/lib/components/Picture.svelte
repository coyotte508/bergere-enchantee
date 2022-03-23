<script lang="ts">
  import type { Picture } from "$lib/db/picture";

  export let picture: Picture;
</script>

{#if picture}
  <img alt="{picture.name}" srcset="{picture.storage.map(format => `/photos/raw/${format._id} ${format.width}w`).join(", ")}" {...$$restProps}>
{/if}