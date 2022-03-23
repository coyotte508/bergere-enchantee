<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";

  export const load: Load = async (input) => {
    const pages = await (await input.fetch("/pages", {headers: {accept: "application/json"}})).json();
    const photos = await (await input.fetch("/photos", {headers: {accept: "application/json"}})).json();

    return { 
      props: {
        pages,
        photos
      }
    };
  };
</script>

<script lang="ts">
  import type { Page } from "$lib/db/page";
  import type { Picture } from "$lib/db/picture";

  export let pages: Page[];
  export let photos: Picture[];
</script>

{#each pages as page}
  <h1>{page.name} ({page._id})</h1>

  <h2 mt-4>Textes</h2>

  {#each Object.keys(page.text) as key}
    <label block w-full mt-4>
       <h3>{key}</h3>
      <textarea name="{page._id}_text_{key}" cols="30" rows="10" block w-full bind:value={page.text[key]}></textarea>
    </label>
  {/each}

  <h2 mt-4>Images</h2>

  {#each Object.keys(page.pictures) as key}
    <label block w-full mt-4>
      <h3>{key}</h3>
      <select name="{page._id}_picture_{key}" bind:value={page.pictures[key]}>
        {#each photos as photo}
          <option value={photo._id}>{photo.name}</option>
        {/each}
      </select>
    </label>
  {/each}
{/each}