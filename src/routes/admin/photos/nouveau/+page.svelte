<script lang="ts">
	import { page } from '$app/stores';
	import { tick } from 'svelte';
	import { readPhotoUpload } from '$lib/utils/photoUpload';

	const productId = $page.url.searchParams.get('productId');

	let photoIdInput: HTMLInputElement | null = null;
	let formInput: HTMLFormElement | null = null;

	let errorMessage = '';

	let loading = false;

	async function submit(event: Event) {
		event.preventDefault();

		if (loading || !formInput) return;
		errorMessage = '';
		if (!formInput.reportValidity()) return;

		const upload = readPhotoUpload(new FormData(formInput));
		if (upload.error !== undefined) {
			errorMessage = upload.error;
			return;
		}
		const { name, file } = upload;

		loading = true;
		try {
			const response = await fetch('/admin/fichiers', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					mimeType: file.type,
					size: file.size,
				}),
			});

			if (!response.ok) {
				errorMessage = 'Impossible de préparer l’envoi de la photo. Veuillez réessayer.';
				return;
			}

			const { _id, url } = await response.json();

			const response2 = await fetch(url, {
				method: 'PUT',
				body: file,
			});

			if (!response2.ok) {
				errorMessage = 'L’envoi de la photo a échoué. Veuillez réessayer.';
				return;
			}

			if (photoIdInput) {
				photoIdInput.value = _id;
			}

			await tick();

			formInput?.submit();
		} catch {
			errorMessage = 'L’envoi de la photo a échoué. Vérifiez votre connexion et réessayez.';
		} finally {
			loading = false;
		}
	}
</script>

<h1 class="text-sunray">Ajouter une photo</h1>

<form
	method="post"
	class="flex flex-col gap-6"
	on:submit|preventDefault={submit}
	bind:this={formInput}
>
	<label class="form-label">
		Nom de la photo
		<input
			class="form-input"
			type="text"
			name="name"
			placeholder="Nom définitif"
			maxlength="255"
			required
		/>
	</label>

	<label class="form-label">
		Fichier JPEG
		<input type="file" name="photo" accept="image/jpeg" class="form-input" required />
	</label>

	{#if productId}
		<p>Produit associé: <a href="/admin/produits/{productId}" class="link">{productId}</a></p>
	{/if}

	<input type="hidden" name="productId" value={productId || ''} />
	<input type="hidden" name="photoId" bind:this={photoIdInput} />

	{#if errorMessage}
		<p role="alert" class="text-red-700">{errorMessage}</p>
	{/if}

	<input type="submit" class="btn self-start" disabled={loading} />
</form>
