<script lang="ts">
  import Container from "$lib/components/Container.svelte";
  import PictureComponent from "$lib/components/Picture.svelte";
  import Masonry from "$lib/components/Masonry.svelte";
  import type { Picture } from "$lib/db/picture";
  import type { CreationsPage } from "$lib/db/page";
  import { page } from "$app/stores";

  const pictures: Picture[] = $page.stuff.pictures.map(p => ({...p, loaded: false}));
  const pageData: CreationsPage = $page.stuff.pageData;
</script>

<Container class="my-4">
  <h1 text-4xl text-oxford mb-3>Tissus et finitions</h1>
  <Masonry>
    {#each pictures as picture}
      <a href="/photos/raw/{picture.storage[0]._id}" relative class="picture-link" data-title={picture.name}>
        <PictureComponent minStorage={1} picture={picture} class="max-w-full {picture.loaded ? 'loaded' : ''}" loading="lazy"></PictureComponent>
      </a>
    {/each}
  </Masonry>
</Container>

<style>

.picture-link {
  overflow: hidden;
}

.picture-link::after {
  position: absolute;
  content: attr(data-title);
  text-align: center;
  left: 0;
  right: 0;
  bottom: 1rem;
  color: white;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 2rem;
  opacity: 0.4;
  transition-duration: 400ms;
}

:global(.picture-link img) {
  transition-duration: 400ms;
  transform: scale(0);
}

:global(.picture-link img.loaded) {
  transform: scale(1);
}

:global(.picture-link:hover img.loaded) {
  transform: scale(1.2);
}

.picture-link:hover::after {
  opacity: 1;
}

</style>