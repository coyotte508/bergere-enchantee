<script lang="ts">
	import { enhance } from '$app/forms';
	import Container from '$lib/components/Container.svelte';
</script>

<Container>
	<slot />

	<form method="post" use:enhance>
		<div class="my-4">
			<label for="email" class="text-sunray text-xl block">Email</label>
			<input
				type="email"
				class="input block"
				required
				name="email"
				id="email"
				placeholder="E-mail"
			/>
		</div>

		<div class="my-4">
			<label for="password" class="text-sunray text-xl block">Mot de passe</label>
			<input
				type="password"
				class="input required"
				name="password"
				id="password"
				placeholder="Mot de passe"
			/>
		</div>

		<button type="submit" class="btn cursor-pointer">Connexion</button>
	</form>

	<p>Pour créer un compte, vous devez effectuer une commande au préalable.</p>

	<p>
		En cas de problème, contactez-moi à <a
			href="mailto:contact@bergereenchantee.fr"
			rel="external"
			class="link">contact@bergereenchantee.fr</a
		>
		ou sur la page <a href="/contact" class="link">contact</a>.
	</p>
</Container>
