<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: user = data.user!;
</script>

<Container>
	<p>
		Bienvenue, {user.email}!
	</p>

	{#if user.admin}
		<p><a href="/admin" class="link">Admin</a></p>
	{/if}

	<form
		action="/deconnexion"
		method="post"
		class="text-sunray text-3xl inline-block cursor-pointer"
	>
		<input type="submit" value="Déconnexion" class="cursor-pointer btn" />
	</form>
</Container>
