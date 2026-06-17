<script lang="ts">
	import { page } from '$app/state';

	let { children } = $props();

	const tabs = [
		{ href: '/admin/pages', label: 'Pages' },
		{ href: '/admin/photos', label: 'Photos' },
		{ href: '/admin/produits', label: 'Produits' },
		{ href: '/admin/commandes', label: 'Commandes' },
	];
</script>

<header class="bg-oxford text-white sticky top-0 z-10 shadow">
	<nav class="max-w-screen-2xl mx-auto flex flex-wrap items-center gap-1 px-4 sm:px-6">
		{#each tabs as tab (tab.href)}
			{@const active = page.url.pathname.startsWith(tab.href)}
			<a
				href={tab.href}
				class="px-4 py-3 font-semibold border-b-2 transition hover:text-sunray"
				class:text-sunray={active}
				class:border-sunray={active}
				class:border-transparent={!active}
			>
				{tab.label}
			</a>
		{/each}
	</nav>
</header>

<main class="max-w-screen-2xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-4">
	{@render children()}
</main>
