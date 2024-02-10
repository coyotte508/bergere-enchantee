<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Picture from '$lib/components/Picture.svelte';
	import { pictureLink } from '$lib/picture';
	import type { PageData } from './$types';
	import { marked } from 'marked';

	export let data: PageData;

	const product = data.product;
	let photoIndex = 0;
	let toBuy = 1;
</script>

<Container>
	<article class="flex my-8 lg:my-16 flex-wrap lg:flex-nowrap">
		<div class="grow lg:basis-0 justify-start items-center flex flex-col">
			<a href={pictureLink(product.photos[photoIndex])} target="_blank">
				<Picture
					picture={product.photos[photoIndex]}
					sizes="(min-width: 1152px) 576px, (max-width: 1024px) 100vw, 50vw"
					title="Cliquez pour voir la photo entière"
					class="max-w-full max-h-md lg:max-h-[36rem] rounded-3xl"
				/>
			</a>
			{#if product.photos.length > 1}
				<div style="gap: 0.5rem" class="flex justify-start w-full ml-8 mt-2">
					{#each product.photos as photo, i}
						<Picture
							picture={photo}
							style="border-color: #865716"
							class="w-16 h-16 object-cover cursor-pointer box-border {i === photoIndex
								? 'border-4'
								: ''} rounded-md"
							on:click={() => (photoIndex = i)}
						/>
					{/each}
				</div>
			{/if}
		</div>
		<div class="grow lg:basis-0 lg:px-8 mt-6 lg:mt-0">
			<h1>{product.name}</h1>

			<div class="mt-4 flex items-center">
				<span class="font-bold text-2xl mr-2" class:line-through={product.stock === 0}
					>{product.price} €</span
				>
				{#if product.stock}(+ frais de livraison hors Finistère){:else}<span class="text-red-500"
						>Produit épuisé!</span
					>{/if}
			</div>
			<div class="marked leading-6">
				<!-- eslint-disable svelte/no-at-html-tags -->
				{@html marked(product.description)}
			</div>

			{#if product.stock}
				<form method="post" action="?/addToCart">
					{#if product.stock > 1}
						<div class="mt-4">
							<button
								type="button"
								class="btn bg-gray-700 rounded-md"
								class:!bg-gray-400={toBuy <= 1}
								disabled={toBuy <= 1}
								class:cursor-default!={toBuy <= 1}
								on:click={() => --toBuy}>-</button
							>
							<span
								class="text-xl text-sunray mx-2 font-bold inline-block text-center"
								style="width: 1rem">{toBuy}</span
							>
							<button
								type="button"
								class="btn bg-gray-700 rounded-md"
								class:!bg-gray-400={toBuy >= product.stock}
								disabled={toBuy >= product.stock}
								on:click={() => ++toBuy}>+</button
							>
						</div>
					{/if}
					<button
						type="submit"
						class="mt-4 text-xl leading-6 py-3 px-6 bg-oxford border-0 shadow text-white rounded-md cursor-pointer"
					>
						Acheter
					</button>
					<div class="flex-grow" />
				</form>
			{/if}
		</div>
	</article>
</Container>
