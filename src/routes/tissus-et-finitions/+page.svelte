<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Picture from '$lib/components/Picture.svelte';
	import Masonry from '$lib/components/Masonry.svelte';
	import type { PageData } from './$types';
	import { pictureLink } from '$lib/picture';

	export let data: PageData;

	const pictures = data.pictures.map((p) => ({ ...p, loaded: false }));
</script>

<Container class="my-4">
	<h1 class="mb-3">Tissus et finitions</h1>
	<Masonry>
		{#each pictures as picture}
			<a href={pictureLink(picture)} class="relative picture-link" data-title={picture.name}>
				<Picture
					sizes="(min-width: 1024px) 33vw, (min-width: 675px) 50vw, 100vw"
					{picture}
					class="max-w-full {picture.loaded ? 'loaded' : ''}"
					loading="lazy"
				/>
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
		opacity: 0.5;
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
