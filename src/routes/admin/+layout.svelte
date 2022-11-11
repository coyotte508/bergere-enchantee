<script lang="ts">
	import { page } from '$app/stores';
	import Container from '$lib/components/Container.svelte';
</script>

<div class="flex justify-evenly mb-10">
	<a
		href="/admin/pages"
		class="pa-2 link"
		class:text-sunray={$page.url.pathname.startsWith('/admin/pages')}>Pages</a
	>
	<a
		href="/admin/photos"
		class="pa-2 link"
		class:text-sunray={$page.url.pathname.startsWith('/admin/photos')}>Photos</a
	>
	<a
		href="/admin/produits"
		class="pa-2 link"
		class:text-sunray={$page.url.pathname.startsWith('/admin/produits')}>Produits</a
	>
</div>

<Container>
	<slot />
</Container>
