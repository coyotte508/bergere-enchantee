<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import PictureComponent from '$lib/components/Picture.svelte';
	import type { CreationsPage } from '$lib/types/Page';
	import { marked } from 'marked';
	import type { PageData } from './$types';

	export let data: PageData;

	const pageData = data.pageData as CreationsPage;
	const pictures = data.pictures;

	type PictureKey = keyof typeof pageData.pictures;

	const picKeys = Object.keys(pageData.pictures).filter(
		(key) => key.startsWith('realisation-') && pageData.pictures[key as PictureKey]
	);
</script>

<Container>
	<h1 class="text-4xl text-oxford mt-4">Nos réalisations</h1>

	{#each picKeys as picKey, i}
		<article
			class="{i % 2
				? 'bg-oxford'
				: 'bg-sunray'} text-white text-lg md:h-xl my-16 flex flex-wrap md:flex-no-wrap rounded-3xl overflow-hidden"
		>
			<div class="grow h-full w-full md:w-3/6 basis-auto md:basis-0" class:md:order-last={i % 2}>
				<PictureComponent
					picture={pictures.find((p) => p._id === pageData.pictures[picKey])}
					sizes="(max-width: 1024px) 50vw, 512px"
					class="w-full h-full object-cover"
				/>
			</div>
			<div class="grow basis-0 flex flex-col relative justify-center">
				<div class="px-4 py-6">
					{@html marked(pageData.text[picKey])}
					<!-- svelte-ignore security-anchor-rel-noreferrer -->
					<a
						href="/photos/raw/{pictures.find((p) => p._id === pageData.pictures[picKey]).storage[0]
							._id}"
						class="underline"
						target="_blank">Photo entière</a
					>
				</div>
			</div>
		</article>
	{/each}
</Container>
