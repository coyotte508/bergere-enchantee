<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Picture from '$lib/components/Picture.svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let data;
	export let form: ActionData;

	$: items = data.items || [];
	$: subtotal = data.subtotal || 0;
	$: shipping = data.shipping || 0;
	$: total = data.total || 0;
</script>

<Container class="my-6 flex flex-col gap-6">
	<h1>Finaliser la commande</h1>

	{#if items.length}
		<!-- Order Summary -->
		<div class="bg-gray-50 p-6 rounded-lg">
			<h2 class="text-xl font-semibold mb-4">Récapitulatif de la commande</h2>

			<div class="space-y-4">
				{#each items as item}
					<div class="flex items-center gap-4 py-2 border-b border-gray-200 last:border-b-0">
						<div class="w-16 h-16 min-w-16 min-h-16 overflow-hidden rounded flex items-center">
							{#if item.picture}
								<Picture
									picture={item.picture}
									class="rounded grow object-cover h-full w-full max-w-full max-h-full"
									sizes="64px"
								/>
							{/if}
						</div>

						<div class="flex-1">
							<h3 class="font-medium">{item.product.name}</h3>
							<p class="text-sm text-gray-600">Quantité: {item.quantity}</p>
						</div>

						<div class="text-right">
							<span class="font-semibold">
								{(item.product.price * item.quantity).toLocaleString('fr', {
									currency: 'EUR',
									style: 'currency',
								})}
							</span>
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-6 pt-4 border-t border-gray-300 space-y-2">
				<div class="flex justify-between items-center">
					<span class="text-lg">Sous-total:</span>
					<span class="text-lg text-oxford">
						{subtotal.toLocaleString('fr', {
							currency: 'EUR',
							style: 'currency',
						})}
					</span>
				</div>
				<div class="flex justify-between items-center">
					<span class="text-lg">Frais de livraison (hors Finistère):</span>
					<span class="text-lg text-oxford">
						{shipping.toLocaleString('fr', {
							currency: 'EUR',
							style: 'currency',
						})}
					</span>
				</div>
				<hr class="border-gray-300" />
				<div class="flex justify-between items-center">
					<span class="text-xl font-semibold">Total:</span>
					<span class="text-2xl font-bold text-oxford">
						{total.toLocaleString('fr', {
							currency: 'EUR',
							style: 'currency',
						})}
					</span>
				</div>
			</div>
		</div>

		<!-- Customer Information Form -->
		<div class="bg-white border border-gray-200 p-6 rounded-lg">
			<h2 class="text-xl font-semibold mb-4">Informations de contact</h2>

			{#if form?.success}
				<div class="info-bubble">
					Votre commande a bien été envoyée ! <br /><br />
					Daphné vous contactera rapidement pour finaliser votre commande et organiser la livraison.
				</div>
			{:else}
				{#if form?.error}
					<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{form.error}
					</div>
				{/if}

				<form method="post" use:enhance class="space-y-4">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
								Prénom *
							</label>
							<input
								type="text"
								id="firstName"
								name="firstName"
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oxford focus:border-transparent"
							/>
						</div>

						<div>
							<label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
								Nom *
							</label>
							<input
								type="text"
								id="lastName"
								name="lastName"
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oxford focus:border-transparent"
							/>
						</div>
					</div>

					<div>
						<label for="email" class="block text-sm font-medium text-gray-700 mb-1">
							Email *
						</label>
						<input
							type="email"
							id="email"
							name="email"
							required
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oxford focus:border-transparent"
						/>
					</div>

					<div>
						<label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
							Téléphone
						</label>
						<input
							type="tel"
							id="phone"
							name="phone"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oxford focus:border-transparent"
						/>
					</div>

					<div>
						<label for="message" class="block text-sm font-medium text-gray-700 mb-1">
							Message (optionnel)
						</label>
						<textarea
							id="message"
							name="message"
							rows="3"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oxford focus:border-transparent"
							placeholder="Informations supplémentaires, préférences de livraison, etc."
						></textarea>
					</div>

					<div class="flex justify-between items-center pt-4">
						<a
							href="/e-shop/panier"
							class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
						>
							← Retour au panier
						</a>
						<button
							type="submit"
							class="px-8 py-3 bg-oxford text-white rounded-md hover:bg-oxford/90 transition-colors font-medium"
						>
							Envoyer la commande
						</button>
					</div>
				</form>
			{/if}
		</div>
	{/if}
</Container>
