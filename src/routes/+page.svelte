<script lang="ts">
	import Carousel from '$lib/components/Carousel.svelte';
	import Container from '$lib/components/Container.svelte';
	import Picture from '$lib/components/Picture.svelte';
	import type { HomePage } from '$lib/types/Page';
	import { typedKeys } from '$lib/utils/typedKeys';
	import { marked } from 'marked';
	import type { PageData } from './$types';

	export let data: PageData;

	const pageData = data.pageData as HomePage;
	const pictures = data.pictures;

	type PictureKey = keyof typeof pageData.pictures;

	const showcasePics = typedKeys(pageData.pictures)
		.filter((key) => key.startsWith('realisation-') && pageData.pictures[key as PictureKey])
		.map((key) => pictures.find((pic) => pic._id === pageData.pictures[key as PictureKey]))
		.filter(Boolean);
</script>

<Container>
	<section class="h-[36rem] relative mt-12">
		<img
			src="/triangles.svg"
			alt="Triangles"
			class="pointer-events-none select-none absolute h-5/6"
			style="left: 38%; top: 50%; transform: translate(-50%, -50%)"
		/>
		<Picture
			picture={pictures.find((p) => p._id === pageData.pictures.discover)}
			sizes="(max-width: 1200px) 50vw, 600px"
			class="absolute top-0 bottom-0 rounded-3xl right-0 w-full sm:w-3/6 h-full object-cover"
		/>
		<h2
			class="drop-white absolute text-oxford text-center sm:text-left text-7xl"
			style="left: 0; top: 50%; transform: translate(0, -50%)"
		>
			Découvrez <br class="hidden sm:inline" /> nos fauteuils
		</h2>
		<a
			href="/realisations"
			class="btn absolute"
			style="left: 25%; top: 75%; transform: translate(-50%, -50%)">cliquez ici</a
		>
	</section>

	<section class="h-[24rem] mt-16 flex mb-16">
		<div class="grow basis-0 h-full">
			<div class="pr-12 h-full">
				<div class="w-full h-full relative">
					<div
						class="rounded-3xl w-full h-full bg-sunray absolute left-4 top-4"
						style="z-index: -1"
					/>
					<Picture
						picture={pictures.find((p) => p._id === pageData.pictures.move)}
						sizes="(max-width: 1024px) 50vw, 512px"
						class="rounded-3xl w-full h-full object-cover"
					/>
				</div>
			</div>
		</div>
		<div class="grow basis-0 flex flex-col relative">
			<h2 class="text-oxford text-4xl mt-6">
				Je me déplace dans le <span class="text-sunray">Finistère</span> sur rendez-vous.
			</h2>
			<a
				href="/contact"
				class="text-white bg-oxford px-4 py-2 rounded-3xl font-bold absolute bottom-0 right-0"
				>en savoir plus</a
			>
		</div>
	</section>

	<section class="marked" style="text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);">
		{@html marked(pageData.text['presentation'])}
	</section>
</Container>

<section class="bg-oxford my-12 py-12 w-full text-center flex flex-col items-center">
	<h2 class="text-4xl text-white">Mes <span class="text-sunray">réalisations</span></h2>
	<a href="/realisations" class="text-white bg-sunray px-4 py-2 rounded-3xl font-bold mt-4"
		>voir plus</a
	>
	<Carousel class="w-full mt-12 h-[36rem] sm:h-2xl">
		{#each showcasePics as pic}
			<div class="w-full h-full flex items-center justify-around">
				<Picture
					picture={pic}
					class="rounded-3xl object-contain"
					style="max-width: 100%; max-height: 100%"
					sizes="(min-width: 650px) 50vw, 95vw"
				/>
			</div>
		{/each}
	</Carousel>
</section>

<Container>
	<section class="h-[36rem] rounded-3xl bg-oxford overflow-hidden flex mb-12">
		<Picture
			class="w-2/6 h-full object-cover"
			sizes="(min-width: 1200px) 400px, 33vw"
			picture={pictures.find((p) => p._id === pageData.pictures['e-shop'])}
		/>
		<div class="w-4/6 h-full px-6 py-12 text-white flex flex-col box-border">
			<h2 class="text-4xl mb-10">
				Notre <span class="text-sunray">e-shop</span> n'attend plus que vous
			</h2>
			{@html marked(pageData.text['eshop-description'])}
			<div class="mt-auto text-center">
				<a href="/e-shop" class="btn-sunray">e-shop</a>
			</div>
		</div>
	</section>
</Container>
