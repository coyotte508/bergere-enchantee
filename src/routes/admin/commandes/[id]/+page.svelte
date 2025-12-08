<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { getOrderStatusDisplay, getOrderStatusColor, ORDER_STATUSES } from '$lib/types/Order';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

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

<div class="mb-4">
	<a href="/admin/commandes" class="text-oxford hover:text-oxford/80"> ← Retour aux commandes </a>
</div>

<div class="flex items-center justify-between mb-6">
	<div>
		<h1 class="text-sunray text-3xl">Commande #{data.order.orderNumber}</h1>
		<p class="text-sm text-gray-500">ID: {data.order._id}</p>
		<p class="text-xs text-gray-400">Clé d'accès: {data.order.accessKey}</p>
	</div>
	<span
		class="inline-flex px-3 py-1 text-sm font-semibold rounded-full {getOrderStatusColor(
			data.order.status
		)}"
	>
		{getOrderStatusDisplay(data.order.status)}
	</span>
</div>

{#if form?.success}
	<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
		Modifications sauvegardées avec succès
	</div>
{/if}

{#if form?.error}
	<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
		{form.error}
	</div>
{/if}

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
	<!-- Order Details -->
	<div class="lg:col-span-2 space-y-6">
		<!-- Customer Information -->
		<div class="bg-white rounded-lg shadow p-6">
			<h2 class="text-xl font-semibold mb-4">Informations client</h2>
			<dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<dt class="text-sm font-medium text-gray-700">Nom complet</dt>
					<dd class="mt-1 text-sm text-gray-900">
						{data.order.customer.firstName}
						{data.order.customer.lastName}
					</dd>
				</div>
				<div>
					<dt class="text-sm font-medium text-gray-700">Email</dt>
					<dd class="mt-1 text-sm text-gray-900">
						<a href="mailto:{data.order.customer.email}" class="text-oxford hover:text-oxford/80">
							{data.order.customer.email}
						</a>
					</dd>
				</div>
				{#if data.order.customer.phone}
					<div>
						<dt class="text-sm font-medium text-gray-700">Téléphone</dt>
						<dd class="mt-1 text-sm text-gray-900">
							<a href="tel:{data.order.customer.phone}" class="text-oxford hover:text-oxford/80">
								{data.order.customer.phone}
							</a>
						</dd>
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
									<span class="inline-block mr-4">Type: {item.productSnapshot.kind}</span>
									<span class="inline-block mr-4"
										>Prix unitaire: {formatPrice(item.productSnapshot.price)}</span
									>
									<span class="inline-block">Quantité: {item.quantity}</span>
								</div>
								{#if item.productSnapshot.shippingPrice > 0}
									<div class="mt-1 text-sm text-gray-500">
										Frais de livraison: {formatPrice(item.productSnapshot.shippingPrice)}
										{#if item.productSnapshot.canGroupShipping}
											<span class="text-xs">(groupable)</span>
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
				<h2 class="text-xl font-semibold mb-4">Message du client</h2>
				<p class="text-gray-700 whitespace-pre-wrap">{data.order.customerMessage}</p>
			</div>
		{/if}
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
			<h2 class="text-xl font-semibold mb-4">Dates</h2>
			<dl class="space-y-2">
				<div>
					<dt class="text-sm font-medium text-gray-700">Créée le</dt>
					<dd class="text-sm text-gray-900">{formatDate(data.order.createdAt)}</dd>
				</div>
				<div>
					<dt class="text-sm font-medium text-gray-700">Dernière modification</dt>
					<dd class="text-sm text-gray-900">{formatDate(data.order.updatedAt)}</dd>
				</div>
			</dl>
		</div>

		<!-- Customer View -->
		<div class="bg-white rounded-lg shadow p-6">
			<h2 class="text-xl font-semibold mb-4">Vue client</h2>
			<a
				href="/commande/{data.order.orderNumber}/{data.order.accessKey}"
				target="_blank"
				class="inline-flex items-center px-4 py-2 bg-oxford text-white rounded-md hover:bg-oxford/90 transition-colors text-sm"
			>
				Voir comme le client
				<svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
					></path>
				</svg>
			</a>
		</div>

		<!-- Status Update -->
		<div class="bg-white rounded-lg shadow p-6">
			<h2 class="text-xl font-semibold mb-4">Changer le statut</h2>
			<form method="post" action="?/updateStatus" use:enhance>
				<select name="status" value={data.order.status} class="form-input w-full mb-3">
					{#each ORDER_STATUSES as status}
						<option value={status} selected={data.order.status === status}>
							{getOrderStatusDisplay(status)}
						</option>
					{/each}
				</select>
				<button type="submit" class="btn w-full"> Mettre à jour le statut </button>
			</form>
		</div>

		<!-- Admin Notes -->
		<div class="bg-white rounded-lg shadow p-6">
			<h2 class="text-xl font-semibold mb-4">Notes administrateur</h2>
			<form method="post" action="?/updateNotes" use:enhance>
				<textarea
					name="adminNotes"
					rows="4"
					class="form-input w-full mb-3"
					placeholder="Notes internes..."
					value={data.order.adminNotes || ''}
				></textarea>
				<button type="submit" class="btn w-full"> Sauvegarder les notes </button>
			</form>
		</div>
	</div>
</div>
