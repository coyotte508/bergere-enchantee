<script lang="ts">
	import { page } from '$app/stores';
	import Container from '$lib/components/Container.svelte';
</script>

<div class="flex justify-evenly mb-10">
	<a
		href="/admin/pages"
		class="p-2 link"
		class:text-sunray={$page.url.pathname.startsWith('/admin/pages')}>Pages</a
	>
	<a
		href="/admin/photos"
		class="p-2 link"
		class:text-sunray={$page.url.pathname.startsWith('/admin/photos')}>Photos</a
	>
	<a
		href="/admin/produits"
		class="p-2 link"
		class:text-sunray={$page.url.pathname.startsWith('/admin/produits')}>Produits</a
	>
</div>

<Container class="flex flex-col gap-4">
	<slot />
</Container>
