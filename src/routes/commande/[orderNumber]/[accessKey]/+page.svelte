<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { getOrderStatusDisplay, getOrderStatusColor } from '$lib/types/Order';
	import type { PageData } from './$types';

	export let data: PageData;

	function formatDate(date: Date | string): string {
		const d = typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	}

	function formatPrice(price: number): string {
		return price.toLocaleString('fr', {
			currency: 'EUR',
			style: 'currency',
		});
	}
</script>

<svelte:head>
	<title>Commande #{data.order.orderNumber} - Bergère Enchantée</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<Container class="my-6 max-w-4xl">
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-3xl font-bold text-oxford">Commande #{data.order.orderNumber}</h1>
		<span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full {getOrderStatusColor(data.order.status)}">
			{getOrderStatusDisplay(data.order.status)}
		</span>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Order Details -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Customer Information -->
			<div class="bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-4">Informations de livraison</h2>
				<dl class="space-y-2">
					<div>
						<dt class="text-sm font-medium text-gray-700">Nom complet</dt>
						<dd class="mt-1 text-sm text-gray-900">
							{data.order.customer.firstName} {data.order.customer.lastName}
						</dd>
					</div>
					<div>
						<dt class="text-sm font-medium text-gray-700">Email</dt>
						<dd class="mt-1 text-sm text-gray-900">{data.order.customer.email}</dd>
					</div>
					{#if data.order.customer.phone}
						<div>
							<dt class="text-sm font-medium text-gray-700">Téléphone</dt>
							<dd class="mt-1 text-sm text-gray-900">{data.order.customer.phone}</dd>
						</div>
					{/if}
				</dl>
			</div>

			<!-- Order Items -->
			<div class="bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-4">Articles commandés</h2>
				<div class="space-y-4">
					{#each data.order.items as item}
						<div class="border border-gray-200 rounded-lg p-4">
							<div class="flex justify-between items-start">
								<div class="flex-1">
									<h3 class="font-medium text-gray-900">{item.productSnapshot.name}</h3>
									<p class="text-sm text-gray-600 mt-1">{item.productSnapshot.description}</p>
									<div class="mt-2 text-sm text-gray-500">
										<span class="inline-block mr-4">Prix unitaire: {formatPrice(item.productSnapshot.price)}</span>
										<span class="inline-block">Quantité: {item.quantity}</span>
									</div>
									{#if item.productSnapshot.shippingPrice > 0}
										<div class="mt-1 text-sm text-gray-500">
											Frais de livraison: {formatPrice(item.productSnapshot.shippingPrice)}
											{#if item.productSnapshot.canGroupShipping}
												<span class="text-xs">(groupable avec d'autres articles)</span>
											{/if}
										</div>
									{/if}
								</div>
								<div class="text-right">
									<div class="font-medium text-gray-900">
										{formatPrice(item.itemSubtotal)}
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Customer Message -->
			{#if data.order.customerMessage}
				<div class="bg-white rounded-lg shadow p-6">
					<h2 class="text-xl font-semibold mb-4">Votre message</h2>
					<p class="text-gray-700 whitespace-pre-wrap">{data.order.customerMessage}</p>
				</div>
			{/if}

			<!-- Order Status Information -->
			<div class="bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-4">Statut de la commande</h2>
				<div class="space-y-3">
					<div class="flex items-center">
						<div class="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
						<span class="text-sm">Commande reçue</span>
						<span class="ml-auto text-xs text-gray-500">{formatDate(data.order.createdAt)}</span>
					</div>
					
					{#if data.order.status !== 'pending'}
						<div class="flex items-center">
							<div class="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
							<span class="text-sm">Commande confirmée</span>
						</div>
					{:else}
						<div class="flex items-center">
							<div class="w-4 h-4 rounded-full bg-gray-300 mr-3"></div>
							<span class="text-sm text-gray-500">En attente de confirmation</span>
						</div>
					{/if}

					{#if ['processing', 'shipped', 'delivered'].includes(data.order.status)}
						<div class="flex items-center">
							<div class="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
							<span class="text-sm">En préparation</span>
						</div>
					{:else}
						<div class="flex items-center">
							<div class="w-4 h-4 rounded-full bg-gray-300 mr-3"></div>
							<span class="text-sm text-gray-500">En préparation</span>
						</div>
					{/if}

					{#if ['shipped', 'delivered'].includes(data.order.status)}
						<div class="flex items-center">
							<div class="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
							<span class="text-sm">Expédiée</span>
						</div>
					{:else}
						<div class="flex items-center">
							<div class="w-4 h-4 rounded-full bg-gray-300 mr-3"></div>
							<span class="text-sm text-gray-500">Expédiée</span>
						</div>
					{/if}

					{#if data.order.status === 'delivered'}
						<div class="flex items-center">
							<div class="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
							<span class="text-sm">Livrée</span>
						</div>
					{:else}
						<div class="flex items-center">
							<div class="w-4 h-4 rounded-full bg-gray-300 mr-3"></div>
							<span class="text-sm text-gray-500">Livrée</span>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Order Summary -->
			<div class="bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-4">Résumé</h2>
				<div class="space-y-2">
					<div class="flex justify-between">
						<span>Sous-total:</span>
						<span>{formatPrice(data.order.subtotal)}</span>
					</div>
					<div class="flex justify-between">
						<span>Livraison:</span>
						<span>{formatPrice(data.order.totalShipping)}</span>
					</div>
					<hr class="my-2" />
					<div class="flex justify-between font-semibold text-lg">
						<span>Total:</span>
						<span>{formatPrice(data.order.total)}</span>
					</div>
				</div>
			</div>

			<!-- Order Dates -->
			<div class="bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-4">Informations</h2>
				<dl class="space-y-2">
					<div>
						<dt class="text-sm font-medium text-gray-700">Commande passée le</dt>
						<dd class="text-sm text-gray-900">{formatDate(data.order.createdAt)}</dd>
					</div>
					<div>
						<dt class="text-sm font-medium text-gray-700">Dernière mise à jour</dt>
						<dd class="text-sm text-gray-900">{formatDate(data.order.updatedAt)}</dd>
					</div>
				</dl>
			</div>

			<!-- Contact Information -->
			<div class="bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-4">Besoin d'aide ?</h2>
				<div class="space-y-2 text-sm">
					<p>Pour toute question concernant votre commande, contactez-nous :</p>
					<div class="mt-3">
						<a href="mailto:contact@bergereenchantee.fr" class="text-oxford hover:text-oxford/80">
							contact@bergereenchantee.fr
						</a>
					</div>
					<div>
						<a href="tel:+33774521115" class="text-oxford hover:text-oxford/80">
							07 74 52 11 15
						</a>
					</div>
					<p class="text-xs text-gray-500 mt-2">
						Référence de commande: #{data.order.orderNumber}
					</p>
				</div>
			</div>
		</div>
	</div>
</Container>
