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
	<h1>Mon panier</h1>

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
					<div class="w-[138px] h-[138px] min-w-[138px] min-h-[138px] rounded flex items-center">
						{#if item.picture}
							<Picture
								picture={item.picture}
								class="rounded grow object-cover h-full w-full"
								sizes="138px"
							/>
						{/if}
					</div>
					<div class="flex flex-col gap-2">
						<h2 class="text-2xl text-gray-850">{item.product.name}</h2>
						<!--<p class="text-sm text-gray-600">{item.product.shortDescription}</p>-->
						<div class="grow" />

						<button
							formaction="/e-shop/panier/{item.productId}/?/remove"
							class="mt-auto mr-auto hover:underline text-blue text-base cursor-pointer font-light"
						>
							Supprimer
						</button>
					</div>
					<div class="self-center">
						Quantité: {item.quantity}
					</div>

					<div class="flex flex-col items-end justify-center">
						<span class="text-2xl text-gray-800">
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

	<div class="border border-blue-500 bg-blue-300 rounded-lg pa-2">
		Le processus de vente à travers le site n'est pas achevé. Contactez Daphné directement pour
		passer commande.
	</div>
</Container>
