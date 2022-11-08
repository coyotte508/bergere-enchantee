<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Masonry from '$lib/components/Masonry.svelte';
	import Picture from '$lib/components/Picture.svelte';
	import type { EshopPage } from '$lib/types/Page';
	import type { PageData } from './$types';

	export let data: PageData;

	const pictures = data.pictures;
	const pageData = data.pageData as EshopPage;

	const { published, retired } = data;
</script>

<div class="h-full-without-banner w-full relative">
	<Picture
		picture={pictures.find((p) => p._id === pageData.pictures.background)}
		class="h-full w-full object-cover absolute top-0 bottom-0 left-0 right-0 bg-brunswick text-white"
		style="z-index: -1"
	/>
	<Container noPadding class="h-full flex flex-col items-stretch md:items-start">
		<div class="grow basis-0" />
		<div style="flex-grow: 2" class="basis-0 text-center md:px-8 xl:px-0">
			<h1 class="text-7xl text-white text-center md:text-left">Découvrez <br />nos ventes</h1>
			<a href="#produits" class="btn mt-10 inline-block">cliquez ici</a>
		</div>
	</Container>
</div>

<Container class="mb-4">
	<h2 class="text-4xl text-oxford my-4" id="produits">Produits à la vente</h2>

	<Masonry>
		{#each published as product}
			<a href="/vente/{product._id}" class="product">
				<Picture picture={product.photos[0]} minStorage={1} class="picture mx-auto" />
				<span class="name">{product.name}</span>
				<span class="price text-right">{product.price} €</span>
			</a>
		{/each}
		<!-- In case there is only one product. We don't want a product to take full row in desktop mode -->
		<div />
	</Masonry>
</Container>

<style>
	.product {
		display: grid;
		gap: 0.5rem;
		grid-template-columns: 1fr auto;
		grid-template-rows: auto auto;
		grid-template-areas:
			'picture picture'
			'name price';
	}

	:global(.product > .picture) {
		grid-area: picture;
		max-height: 24rem;
		max-width: 100%;
	}

	.product > .name {
		grid-area: name;

		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.product > .price {
		grid-area: price;
	}
</style>
