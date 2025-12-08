<script lang="ts">
	import Picture from '$lib/components/Picture.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="text-sunray">Liste des produits</h1>

<div class="mb-6">
	<a href="/admin/produits/nouveau" class="btn bg-green-600 text-white hover:bg-green-700">
		+ Nouveau produit
	</a>
</div>

<!-- Active Products -->
{#if data.activeProducts.length > 0}
	<section class="mb-8">
		<h2 class="text-2xl font-semibold text-green-600 mb-4">
			Produits actifs ({data.activeProducts.length})
		</h2>
		<div class="flex flex-row flex-wrap gap-6">
			{#each data.activeProducts as product}
				<div class="flex flex-col text-center">
					<a href="/admin/produits/{product._id}" class="flex flex-col items-center">
						<div class="relative overflow-hidden rounded-lg">
							<Picture picture={product.photos[0]} class="h-36 w-36 object-cover block rounded-lg" />
							{#if product.stock > 1}
								<div class="absolute z-10 top-0 right-0 p-2 bg-sunray text-white font-bold rounded-bl-lg text-xs">
									x{product.stock}
								</div>
							{:else}
								<div class="absolute z-10 top-0 right-0 p-2 bg-green-500 text-white font-bold rounded-bl-lg text-xs">
									1
								</div>
							{/if}
						</div>
						<span class="mt-2 font-medium">{product.name}</span>
						<span class="text-sm text-gray-600">{product.price} €</span>
					</a>
				</div>
			{/each}
		</div>
	</section>
{/if}

<!-- Draft Products -->
{#if data.draftProducts.length > 0}
	<section class="mb-8">
		<h2 class="text-2xl font-semibold text-yellow-600 mb-4">
			Brouillons ({data.draftProducts.length})
		</h2>
		<div class="flex flex-row flex-wrap gap-6">
			{#each data.draftProducts as product}
				<div class="flex flex-col text-center">
					<a href="/admin/produits/{product._id}" class="flex flex-col items-center">
						<div class="relative overflow-hidden rounded-lg">
							<Picture picture={product.photos[0]} class="h-36 w-36 object-cover block rounded-lg opacity-75" />
							<div class="absolute z-10 top-0 right-0 p-2 bg-yellow-500 text-white font-bold rounded-bl-lg text-xs">
								DRAFT
							</div>
						</div>
						<span class="mt-2 font-medium text-gray-700">{product.name}</span>
						<span class="text-sm text-gray-500">{product.price} €</span>
					</a>
				</div>
			{/each}
		</div>
	</section>
{/if}

<!-- Sold Out Products -->
{#if data.soldOutProducts.length > 0}
	<section class="mb-8">
		<h2 class="text-2xl font-semibold text-red-600 mb-4">
			Épuisés ({data.soldOutProducts.length})
		</h2>
		<div class="flex flex-row flex-wrap gap-6">
			{#each data.soldOutProducts as product}
				<div class="flex flex-col text-center">
					<a href="/admin/produits/{product._id}" class="flex flex-col items-center">
						<div class="relative overflow-hidden rounded-lg">
							<Picture picture={product.photos[0]} class="h-36 w-36 object-cover block rounded-lg grayscale" />
							<div class="absolute z-10 top-0 right-0 p-2 bg-red-500 text-white font-bold rounded-bl-lg text-xs">
								SOLD OUT
							</div>
						</div>
						<span class="mt-2 font-medium text-gray-700">{product.name}</span>
						<span class="text-sm text-gray-500">{product.price} €</span>
					</a>
				</div>
			{/each}
		</div>
	</section>
{/if}

<!-- Empty State -->
{#if data.products.length === 0}
	<div class="text-center py-12">
		<p class="text-gray-500 text-lg mb-4">Aucun produit trouvé</p>
		<a href="/admin/produits/nouveau" class="btn bg-green-600 text-white hover:bg-green-700">
			Créer le premier produit
		</a>
	</div>
{/if}
