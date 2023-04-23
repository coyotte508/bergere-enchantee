<script lang="ts">
	import Picture from '$lib/components/Picture.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="text-sunray">Liste des photos sans produit</h1>

<a href="/admin/photos/nouveau" class="my-4 block link">Nouvelle photo</a>

<div class="flex flex-row flex-wrap gap-6 mt-6">
	{#each data.photos as photo}
		<div class="flex flex-col text-center">
			<a href="/admin/photos/{photo._id}" class="flex flex-col items-center">
				<Picture picture={photo} class="h-36 block" />
				<span>{photo.name}</span>
			</a>
		</div>
	{/each}
</div>
