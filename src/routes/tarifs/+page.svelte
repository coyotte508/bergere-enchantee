<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Picture from '$lib/components/Picture.svelte';
	import type { PricingPage } from '$lib/types/Page.js';

	export let data;

	const pictures = data.pictures;
	const pageData = data.pageData as PricingPage;

	const array = Array(12)
		.fill(0)
		.map((_, i) => i + 1);
</script>

<section class="relative py-12">
	<Picture
		picture={pictures.find((p) => p._id === pageData.pictures['remplacement-tissu'])}
		sizes="100vw"
		class="h-full w-full object-cover absolute top-0 bottom-0 left-0 right-0 bg-brunswick"
		style="z-index: -1; filter: brightness(0.7)"
	/>
	<Container class="text-center flex flex-col gap-10">
		<h2
			class="text-oxford text-3xl font-aileron"
			style="filter: drop-shadow(white 1px 1px 0.15rem) drop-shadow(white -1px -1px 0.15rem)"
		>
			Changement de tissu uniquement
		</h2>
		<div
			class="grid gap-6 w-full grid-cols-1 sm:grid-cols-4 md:grid-cols-6 sm:[&>*]:col-span-2 justify-center"
		>
			{#each array as i}
				{#if pageData.text[`remplacement-tissu-${i}-titre`] && pageData.text[`remplacement-tissu-${i}-prix`]}
					<article class="item">
						<p class="text-white text-xl">{pageData.text[`remplacement-tissu-${i}-titre`]}</p>
						<p class="text-gray-300">{pageData.text[`remplacement-tissu-${i}-prix`]}</p>
					</article>
				{/if}
			{/each}
		</div>
		<a href="/contact" class="btn-sunray self-center">Contactez moi</a>
	</Container>
</section>
<section class="relative py-12">
	<Picture
		picture={pictures.find((p) => p._id === pageData.pictures['refection-complete'])}
		sizes="100vw"
		class="h-full w-full object-cover absolute top-0 bottom-0 left-0 right-0 bg-brunswick"
		style="z-index: -1; filter: brightness(0.7)"
	/>
	<Container class="text-center flex flex-col gap-10">
		<h2
			class="text-oxford text-3xl font-aileron"
			style="filter: drop-shadow(white 1px 1px 0.15rem) drop-shadow(white -1px -1px 0.15rem)"
		>
			Réfèction complète
		</h2>
		<div class="grid gap-6 w-full grid-cols-1 sm:grid-cols-4 md:grid-cols-6 sm:[&>*]:col-span-2">
			{#each array as i}
				{#if pageData.text[`refection-complete-${i}-titre`] && pageData.text[`refection-complete-${i}-prix`]}
					<article class="item">
						<p class="text-white text-xl">{pageData.text[`refection-complete-${i}-titre`]}</p>
						<p class="text-gray-300">{pageData.text[`refection-complete-${i}-prix`]}</p>
					</article>
				{/if}
			{/each}
		</div>
		<a href="/contact" class="btn-sunray self-center">Contactez moi</a>
	</Container>
</section>
<section class="relative py-12">
	<Picture
		picture={pictures.find((p) => p._id === pageData.pictures['coussin'])}
		sizes="100vw"
		class="h-full w-full object-cover absolute top-0 bottom-0 left-0 right-0 bg-brunswick"
		style="z-index: -1; filter: brightness(0.7)"
	/>
	<Container class="text-center flex flex-col gap-10">
		<h2
			class="text-oxford text-3xl font-aileron"
			style="filter: drop-shadow(white 1px 1px 0.15rem) drop-shadow(white -1px -1px 0.15rem)"
		>
			Coussins
		</h2>
		<div class="grid gap-6 w-full grid-cols-1 sm:grid-cols-4 md:grid-cols-6 sm:[&>*]:col-span-2">
			{#each array as i}
				{#if pageData.text[`coussin-${i}-titre`] && pageData.text[`coussin-${i}-prix`]}
					<article class="item">
						<p class="text-white text-xl">{pageData.text[`coussin-${i}-titre`]}</p>
						<p class="text-gray-300">{pageData.text[`coussin-${i}-prix`]}</p>
					</article>
				{/if}
			{/each}
		</div>
		<a href="/contact" class="btn-sunray self-center">Contactez moi</a>
	</Container>
</section>

<style>
	@media (min-width: 640px) {
		/* Dealing with single orphan */

		.item:last-child:nth-child(2n + 1) {
			grid-column-end: 4;
		}
	}

	@media (min-width: 768px) {
		/* Dealing with 2 orphan items */

		.item:last-child:nth-child(3n - 1) {
			grid-column-end: -2;
		}

		.item:nth-last-child(2):nth-child(3n + 1) {
			grid-column-end: 4;
		}

		/* Dealing with single orphan */

		.item:last-child:nth-child(3n - 2) {
			grid-column-end: 5;
		}
	}
</style>
