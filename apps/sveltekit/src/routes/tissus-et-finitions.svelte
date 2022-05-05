<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import PictureComponent from "$lib/components/Picture.svelte";
  import Masonry from "$lib/components/Masonry.svelte";
  import type { Picture } from "$lib/db/picture";
  import type { CreationsPage } from "$lib/db/page";
  import { page } from "$app/stores";

  const pictures: Picture[] = $page.stuff.pictures;
  const pageData: CreationsPage = $page.stuff.pageData;
</script>

<Container class="my-4">
  <h1 text-4xl text-oxford>Tissus et finitions</h1>
  <Masonry>
    {#each pictures as picture}
      <a href="/photos/raw/{picture.storage[0]._id}" target="_blank" class="inline">
        <PictureComponent picture={picture} class="max-w-full"></PictureComponent>
      </a>
    {/each}
  </Masonry>
</Container>