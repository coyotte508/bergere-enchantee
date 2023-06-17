<script>
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Container from '$lib/components/Container.svelte';
	import Picture from '$lib/components/Picture.svelte';

	export let data;

	let actionCount = 0;

	$: items = data.items || [];
	// $: totalPrice = sum(items.map((item) => item.product.price.amount * item.quantity));
</script>

<Container class="my-6 flex flex-col gap-6">
	<h1 class="text-3xl">Mon panier</h1>

	{#if data.items.length}
		<div class="grid gap-x-4 gap-y-6" style="grid-template-columns: auto 1fr auto auto">
			{#each data.items as item}
				<form
					class="contents"
					method="post"
					use:enhance={({ action }) => {
						if (action.searchParams.has('/increase')) {
							item.quantity++;
						} else if (action.searchParams.has('/decrease')) {
							item.quantity--;
						} else if (action.searchParams.has('/remove')) {
							item.quantity = 0;
						}
						actionCount++;
						let currentActionCount = actionCount;

						return async ({ result }) => {
							if (actionCount === currentActionCount) {
								if (result.type === 'redirect') {
									// Invalidate all to remove 0-quantity items
									await goto(result.location, { noScroll: true, invalidateAll: true });
									return;
								}
								await applyAction(result);
							}
						};
					}}
				>
					<a
						class="w-[90px] h-[90px] min-w-[90px] min-h-[90px] sm:w-[138px] sm:h-[138px] sm:min-w-[138px] sm:min-h-[138px] rounded flex items-center self-center"
						href="/e-shop/{item.productId}"
					>
						{#if item.picture}
							<Picture
								picture={item.picture}
								class="rounded grow object-cover h-full w-full"
								sizes="138px"
							/>
						{/if}
					</a>
					<div class="flex flex-col gap-2">
						<h2 class="text-2xl ">{item.product.name}</h2>
						<!--<p class="text-sm text-gray-600">{item.product.shortDescription}</p>-->
						<div class="grow whitespace-break-spaces sm:line-clamp-3 hidden">
							{item.product.description}
						</div>

						<button
							formaction="/e-shop/panier/{item.productId}/?/remove"
							class="mt-auto mr-auto hover:underline text-oxford text-base cursor-pointer font-light"
						>
							Supprimer
						</button>
					</div>
					<div class="self-center">
						<input type="hidden" name="quantity" value={item.quantity} />
						{#if item.product.stock > 1 || item.quantity > 1}
							<button
								type="submit"
								class="btn bg-gray-700 rounded-md"
								formaction="/e-shop/panier/{item.productId}/?/decrease">-</button
							>
							<span
								class="text-xl text-sunray mx-2 font-bold inline-block text-center"
								style="width: 1rem">{item.quantity}</span
							>
							<button
								type="submit"
								class="btn bg-gray-700 rounded-md"
								formaction="/e-shop/panier/{item.productId}/?/increase"
								class:!bg-gray-400={item.quantity >= item.product.stock}
								disabled={item.quantity >= item.product.stock}>+</button
							>
						{/if}
					</div>

					<div class="flex flex-col items-end justify-center">
						<span class="text-2xl text-oxford">
							{(item.product.price * item.quantity).toLocaleString('fr', {
								currency: 'EUR',
								style: 'currency'
							})}
						</span>
					</div>
				</form>
			{/each}
		</div>
	{:else}
		<p>Votre panier est vide</p>
	{/if}

	<div class="border border-blue-500 bg-blue-300 rounded-lg p-2">
		Le processus de vente à travers le site n'est pas achevé. Contactez Daphné directement pour
		passer commande.
	</div>
</Container>
