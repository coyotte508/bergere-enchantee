<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";

  export const load: Load = async (input) => {
    const photos = await input.fetch("/api/photos");
    if (!photos.ok) {
      throw new Error("Erreur en récupérant les photos: " + photos.status);
    }

    return {
      props: {
        photos: await photos.json()
      }
    };
  }
</script>

<script lang="ts">
  import type { Picture } from "$lib/db/picture";

  export let photos: Picture[];
</script>

<h1 text-sunray>Ajouter une photo</h1>

<form method="post" enctype="multipart/form-data">
  <label block my-4 leading-8>
    Nom de la photo
    <input input type="text" name="name" block placeholder="Nom définitif" required>
  </label>

  <label block my-4 leading-8>
    Fichier JPEG
    <input type="file" name="photo" accept="image/jpeg" block required>
  </label>

  <input type="submit" hidden>
</form>

<h1 text-sunray>Liste des photos</h1>

<div flex flex-row gap-6 mt-6>
{#each photos as photo }
  {@const format = photo.storage.slice(-1)[0]}
  <div flex flex-col text-center>
    <img src="/photo/raw/{format._id}" alt={photo.name} h-36 style="object-fit: scale-down;" >
    <span>{photo.name}</span>
  </div>
{/each}
</div>