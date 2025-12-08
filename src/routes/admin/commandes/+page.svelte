<script lang="ts">
	import type { PageData } from './$types';
	import { getOrderStatusDisplay, getOrderStatusColor } from '$lib/types/Order';

	export let data: PageData;

	function formatDate(date: Date | string): string {
		const d = typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'short',
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

<h1 class="text-sunray text-3xl mb-6">Gestion des commandes</h1>

<div class="mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
	<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
		<div class="text-2xl font-bold text-yellow-800">{data.pendingOrders.length}</div>
		<div class="text-sm text-yellow-600">En attente</div>
	</div>
	<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
		<div class="text-2xl font-bold text-blue-800">{data.confirmedOrders.length}</div>
		<div class="text-sm text-blue-600">Confirmées</div>
	</div>
	<div class="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
		<div class="text-2xl font-bold text-purple-800">{data.processingOrders.length}</div>
		<div class="text-sm text-purple-600">En préparation</div>
	</div>
	<div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
		<div class="text-2xl font-bold text-indigo-800">{data.shippedOrders.length}</div>
		<div class="text-sm text-indigo-600">Expédiées</div>
	</div>
	<div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
		<div class="text-2xl font-bold text-green-800">{data.deliveredOrders.length}</div>
		<div class="text-sm text-green-600">Livrées</div>
	</div>
	<div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
		<div class="text-2xl font-bold text-red-800">{data.cancelledOrders.length}</div>
		<div class="text-sm text-red-600">Annulées</div>
	</div>
</div>

{#if data.orders.length === 0}
	<div class="text-center py-12">
		<p class="text-gray-500 text-lg">Aucune commande trouvée</p>
	</div>
{:else}
	<div class="bg-white rounded-lg shadow overflow-hidden">
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Commande
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Client
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Articles
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Total
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Statut
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Date
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each data.orders as order}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">#{order.orderNumber}</div>
								<div class="text-xs text-gray-500">ID: {order._id}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">
									{order.customer.firstName}
									{order.customer.lastName}
								</div>
								<div class="text-sm text-gray-500">{order.customer.email}</div>
								{#if order.customer.phone}
									<div class="text-sm text-gray-500">{order.customer.phone}</div>
								{/if}
							</td>
							<td class="px-6 py-4">
								<div class="text-sm text-gray-900">
									{order.items.length} article{order.items.length > 1 ? 's' : ''}
								</div>
								<div class="text-xs text-gray-500">
									{order.items
										.map((item) => `${item.productSnapshot.name} (x${item.quantity})`)
										.join(', ')}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">{formatPrice(order.total)}</div>
								<div class="text-xs text-gray-500">
									Sous-total: {formatPrice(order.subtotal)}
								</div>
								<div class="text-xs text-gray-500">
									Livraison: {formatPrice(order.totalShipping)}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getOrderStatusColor(
										order.status
									)}"
								>
									{getOrderStatusDisplay(order.status)}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{formatDate(order.createdAt)}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
								<a href="/admin/commandes/{order._id}" class="text-oxford hover:text-oxford/80">
									Voir détails
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}
