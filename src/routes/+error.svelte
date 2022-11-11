<script lang="ts">
	import { page } from '$app/stores';
	import Container from '$lib/components/Container.svelte';
</script>

<Container class="flex items-center h-full">
	<div class="mx-auto text-center">
		<p class="text-3xl">Erreur <b class="text-sunray">{$page.status}</b></p>
		<p class="text-2xl">{$page.error?.message}</p>
		<p>
			En cas de problème, contactez-moi à <a
				href="mailto:contact@bergereenchantee.fr"
				rel="external"
				class="link">contact@bergereenchantee.fr</a
			>
			ou sur la page <a href="/contact" class="link">contact</a>.
		</p>
	</div>
</Container>

<slot />
