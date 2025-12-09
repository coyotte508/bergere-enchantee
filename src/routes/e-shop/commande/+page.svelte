<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Picture from '$lib/components/Picture.svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { onMount } from 'svelte';
	import { calculateTotalWithShipping, isFreeShipping, isDomTom } from '$lib/utils/shipping.js';
	import type { Address } from '$lib/types/Order.js';

	export let data;
	export let form: ActionData;

	$: items = data.items || [];
	$: initialSubtotal = data.subtotal || 0;
	$: initialShipping = data.shipping || 0;
	$: initialTotal = data.total || 0;

	let sameAsBillingCheckbox: HTMLInputElement;
	let shippingAddressFields: HTMLDivElement;

	// Address form fields
	let billingName = '';
	let billingStreet = '';
	let billingAdditionalInfo = '';
	let billingCity = '';
	let billingZipCode = '';
	let billingCountry = 'France';
	let shippingName = '';
	let shippingStreet = '';
	let shippingAdditionalInfo = '';
	let shippingCity = '';
	let shippingZipCode = '';
	let shippingCountry = 'France';
	let sameAsBilling = true;

	// Reactive calculations
	$: billingAddress = {
		name: billingName,
		street: billingStreet,
		additionalInfo: billingAdditionalInfo,
		city: billingCity,
		zipCode: billingZipCode,
		country: billingCountry,
	} as Address;

	$: currentShippingAddress = sameAsBilling
		? billingAddress
		: ({
				name: shippingName,
				street: shippingStreet,
				additionalInfo: shippingAdditionalInfo,
				city: shippingCity,
				zipCode: shippingZipCode,
				country: shippingCountry,
			} as Address);

	// Calculate shipping dynamically
	$: dynamicShipping = (() => {
		// Only calculate if we have a valid zip code
		const zipCode = currentShippingAddress.zipCode;
		if (!zipCode || zipCode.length !== 5) {
			return initialShipping;
		}

		// Check for DOM-TOM (should show error, but for calculation use 0)
		if (isDomTom(zipCode)) {
			return 0;
		}

		// Free shipping for Finistère
		if (isFreeShipping(zipCode)) {
			return 0;
		}

		// Otherwise use initial shipping calculation
		return initialShipping;
	})();

	$: dynamicTotal = initialSubtotal + dynamicShipping;

	// Shipping status message
	$: shippingStatus = (() => {
		const zipCode = currentShippingAddress.zipCode;
		if (!zipCode || zipCode.length !== 5) {
			return 'Frais de livraison standard';
		}

		if (isDomTom(zipCode)) {
			return 'Livraison non disponible vers les DOM-TOM';
		}

		if (isFreeShipping(zipCode)) {
			return 'Livraison gratuite (Finistère)';
		}

		return 'Frais de livraison standard';
	})();

	function toggleShippingFields() {
		if (sameAsBilling) {
			// Clear shipping fields when hidden
			shippingName = '';
			shippingStreet = '';
			shippingAdditionalInfo = '';
			shippingCity = '';
			shippingZipCode = '';
			shippingCountry = 'France';
		}
	}

	// Watch for changes to sameAsBilling
	$: {
		if (typeof window !== 'undefined') {
			toggleShippingFields();
		}
	}

	onMount(() => {
		toggleShippingFields(); // Initial state
	});
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
						{initialSubtotal.toLocaleString('fr', {
							currency: 'EUR',
							style: 'currency',
						})}
					</span>
				</div>
				<div class="flex justify-between items-center">
					<div class="flex flex-col">
						<span class="text-lg">Frais de livraison:</span>
						<span class="text-sm text-gray-600 italic">{shippingStatus}</span>
					</div>
					<span class="text-lg text-oxford">
						{dynamicShipping.toLocaleString('fr', {
							currency: 'EUR',
							style: 'currency',
						})}
					</span>
				</div>
				<hr class="border-gray-300" />
				<div class="flex justify-between items-center">
					<span class="text-xl font-semibold">Total:</span>
					<span class="text-2xl font-bold text-oxford">
						{dynamicTotal.toLocaleString('fr', {
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
					Votre commande #{form.orderNumber} a bien été envoyée ! <br /><br />
					Daphné vous contactera rapidement pour finaliser votre commande et organiser la livraison.
					<br /><br />
					<strong>Suivez votre commande :</strong><br />
					<a
						href="/commande/{form.orderNumber}/{form.accessKey}"
						class="text-oxford hover:text-oxford/80 underline"
					>
						Voir le statut de votre commande
					</a>
				</div>
			{:else}
				{#if form?.error}
					<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{form.error}
					</div>
				{/if}

				<form method="post" use:enhance class="space-y-6">
					<!-- Customer Information -->
					<div>
						<h3 class="text-lg font-medium text-gray-900 mb-3">Informations de contact</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
						</div>
					</div>

					<!-- Billing Address -->
					<div>
						<h3 class="text-lg font-medium text-gray-900 mb-3">Adresse de facturation</h3>
						<div class="space-y-4">
							<div>
								<label for="billingName" class="block text-sm font-medium text-gray-700 mb-1">
									Nom complet *
								</label>
								<input
									type="text"
									id="billingName"
									name="billingName"
									bind:value={billingName}
									required
									placeholder="Prénom et nom"
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oxford focus:border-transparent"
								/>
							</div>

							<div>
								<label for="billingStreet" class="block text-sm font-medium text-gray-700 mb-1">
									Adresse *
								</label>
								<input
									type="text"
									id="billingStreet"
									name="billingStreet"
									bind:value={billingStreet}
									required
									placeholder="Numéro et nom de rue"
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oxford focus:border-transparent"
								/>
							</div>

							<div>
								<label
									for="billingAdditionalInfo"
									class="block text-sm font-medium text-gray-700 mb-1"
								>
									Complément d'adresse
								</label>
								<input
									type="text"
									id="billingAdditionalInfo"
									name="billingAdditionalInfo"
									bind:value={billingAdditionalInfo}
									placeholder="Appartement, étage, bâtiment, etc."
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oxford focus:border-transparent"
								/>
							</div>

							<div class="grid grid-cols-2 gap-4">
								<div>
									<label for="billingZipCode" class="block text-sm font-medium text-gray-700 mb-1">
										Code postal *
									</label>
									<input
										type="text"
										id="billingZipCode"
										name="billingZipCode"
										bind:value={billingZipCode}
										required
										pattern="[0-9]{5}"
										placeholder="29000"
										class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oxford focus:border-transparent"
									/>
								</div>

								<div>
									<label for="billingCity" class="block text-sm font-medium text-gray-700 mb-1">
										Ville *
									</label>
									<input
										type="text"
										id="billingCity"
										name="billingCity"
										bind:value={billingCity}
										required
										placeholder="Quimper"
										class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oxford focus:border-transparent"
									/>
								</div>
							</div>

							<div>
								<label for="billingCountry" class="block text-sm font-medium text-gray-700 mb-1">
									Pays *
								</label>
								<input
									type="text"
									id="billingCountry"
									name="billingCountry"
									bind:value={billingCountry}
									readonly
									class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
								/>
							</div>
						</div>
					</div>

					<!-- Shipping Address -->
					<div>
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-lg font-medium text-gray-900">Adresse de livraison</h3>
							<label class="flex items-center">
								<input
									type="checkbox"
									id="sameAsBilling"
									name="sameAsBilling"
									bind:checked={sameAsBilling}
									bind:this={sameAsBillingCheckbox}
									class="mr-2 h-4 w-4 text-oxford focus:ring-oxford border-gray-300 rounded"
								/>
								<span class="text-sm text-gray-700">Identique à l'adresse de facturation</span>
							</label>
						</div>

						<div bind:this={shippingAddressFields} class="space-y-4" class:hidden={sameAsBilling}>
							<div>
								<label for="shippingName" class="block text-sm font-medium text-gray-700 mb-1">
									Nom complet *
								</label>
								<input
									type="text"
									id="shippingName"
									name="shippingName"
									bind:value={shippingName}
									required={!sameAsBilling}
									placeholder="Prénom et nom"
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oxford focus:border-transparent"
								/>
							</div>

							<div>
								<label for="shippingStreet" class="block text-sm font-medium text-gray-700 mb-1">
									Adresse *
								</label>
								<input
									type="text"
									id="shippingStreet"
									name="shippingStreet"
									bind:value={shippingStreet}
									required={!sameAsBilling}
									placeholder="Numéro et nom de rue"
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oxford focus:border-transparent"
								/>
							</div>

							<div>
								<label
									for="shippingAdditionalInfo"
									class="block text-sm font-medium text-gray-700 mb-1"
								>
									Complément d'adresse
								</label>
								<input
									type="text"
									id="shippingAdditionalInfo"
									name="shippingAdditionalInfo"
									bind:value={shippingAdditionalInfo}
									placeholder="Appartement, étage, bâtiment, etc."
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oxford focus:border-transparent"
								/>
							</div>

							<div class="grid grid-cols-2 gap-4">
								<div>
									<label for="shippingZipCode" class="block text-sm font-medium text-gray-700 mb-1">
										Code postal *
									</label>
									<input
										type="text"
										id="shippingZipCode"
										name="shippingZipCode"
										bind:value={shippingZipCode}
										required={!sameAsBilling}
										pattern="[0-9]{5}"
										placeholder="29000"
										class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oxford focus:border-transparent"
									/>
								</div>

								<div>
									<label for="shippingCity" class="block text-sm font-medium text-gray-700 mb-1">
										Ville *
									</label>
									<input
										type="text"
										id="shippingCity"
										name="shippingCity"
										bind:value={shippingCity}
										required={!sameAsBilling}
										placeholder="Quimper"
										class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oxford focus:border-transparent"
									/>
								</div>
							</div>

							<div>
								<label for="shippingCountry" class="block text-sm font-medium text-gray-700 mb-1">
									Pays *
								</label>
								<input
									type="text"
									id="shippingCountry"
									name="shippingCountry"
									bind:value={shippingCountry}
									readonly
									class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
								/>
							</div>
						</div>

						<div class="mt-4">
							{#if currentShippingAddress.zipCode && isDomTom(currentShippingAddress.zipCode)}
								<div class="p-3 bg-red-50 border border-red-200 rounded-md">
									<p class="text-sm text-red-800">
										<strong>⚠️ Livraison non disponible</strong><br />
										Les livraisons vers les DOM-TOM ne sont pas disponibles actuellement.
									</p>
								</div>
							{:else if currentShippingAddress.zipCode && isFreeShipping(currentShippingAddress.zipCode)}
								<div class="p-3 bg-green-50 border border-green-200 rounded-md">
									<p class="text-sm text-green-800">
										<strong>🎉 Livraison gratuite !</strong><br />
										Vous bénéficiez de la livraison gratuite pour le Finistère (29).
									</p>
								</div>
							{:else}
								<div class="p-3 bg-blue-50 border border-blue-200 rounded-md">
									<p class="text-sm text-blue-800">
										<strong>Livraison gratuite</strong> pour le Finistère (29) !<br />
										Les livraisons sont uniquement disponibles en France métropolitaine.
									</p>
								</div>
							{/if}
						</div>
					</div>

					<!-- Message -->
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
							disabled={!!(
								currentShippingAddress.zipCode && isDomTom(currentShippingAddress.zipCode)
							)}
							class="px-8 py-3 bg-oxford text-white rounded-md hover:bg-oxford/90 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
						>
							{#if currentShippingAddress.zipCode && isDomTom(currentShippingAddress.zipCode)}
								Livraison non disponible
							{:else}
								Envoyer la commande
							{/if}
						</button>
					</div>
				</form>
			{/if}
		</div>
	{/if}
</Container>
