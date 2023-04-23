<script lang="ts">
	import Picture from '$lib/components/Picture.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<a href="/admin/produits/nouveau" class="link">Nouveau produit</a>

<h1 class="text-sunray mt-10">Liste des produits</h1>

<div class="flex flex-row flex-wrap gap-6 mt-6">
	{#each data.products as product}
		<div class="flex flex-col text-center">
			<a href="/admin/produits/{product._id}" class="flex flex-col items-center">
				<Picture picture={product.photos[0]} class="h-36 block" />
				<span class="mt-2">{product.name}</span>
			</a>
		</div>
	{/each}
</div>
