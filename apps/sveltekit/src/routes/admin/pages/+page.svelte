<script lang="ts">
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  import type { Page } from "$lib/db/page";
  import type { Picture } from "$lib/db/picture";

  export let pages: Page[];
  export let photos: Picture[];

  function updatePicture(page: Page, key: string, value: string) {
    fetch("/admin/pages/" + encodeURIComponent(page._id), {
      method: "POST", 
      headers: {"content-type": "application/json"}, 
      body: JSON.stringify({type: "picture", key, value})
    });
  }

  function updateText(page: Page, key: string, value: string) {
    fetch("/admin/pages/" + encodeURIComponent(page._id), {
      method: "POST", 
      headers: {"content-type": "application/json"}, 
      body: JSON.stringify({type: "text", key, value})
    });
  }
</script>

{#each pages as page}
  <section mb-6>
    <h1>{page.name} ({page._id})</h1>

    <h2 mt-4>Textes</h2>

    {#each Object.keys(page.text) as key}
      <label block w-full mt-4>
        <h3>{key}</h3>
        <textarea name="{page._id}_text_{key}" cols="30" rows="10" block w-full value={page.text[key]} on:blur={(event) => updateText(page, key, event.target.value)}></textarea>
      </label>
    {/each}

    <h2 mt-4>Images</h2>

    {#each Object.keys(page.pictures) as key}
      <label block w-full mt-4>
        <h3>{key}</h3>
        <select name="{page._id}_picture_{key}" value={page.pictures[key]} on:change={(event) => updatePicture(page, key, event.target.value)}>
          {#each photos as photo}
            <option value={photo._id}>{photo.name}</option>
          {/each}
        </select>
      </label>
    {/each}
  </section>
{/each}