<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: user = data.user!;
</script>

<Container class="flex flex-col gap-6">
	<p>
		Bienvenue, {user.email}!
	</p>

	{#if user.admin}
		<p><a href="/admin" class="link">Admin</a></p>
	{/if}

	<form action="/deconnexion" method="post" class="text-sunray inline-block">
		<input type="submit" value="Déconnexion" class="btn" />
	</form>
</Container>
