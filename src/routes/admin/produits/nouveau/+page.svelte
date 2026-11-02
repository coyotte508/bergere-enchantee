<script lang="ts">
	import { tick } from 'svelte';
	import { readPhotoUpload } from '$lib/utils/photoUpload';

	let formInput: HTMLFormElement | null = null;
	let photoIdInput: HTMLInputElement | null = null;

	let loading = false;
	let errorMessage = '';

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

<h1 class="text-sunray">Ajouter un produit</h1>

<form
	method="post"
	class="flex gap-4 flex-col"
	bind:this={formInput}
	on:submit|preventDefault={submit}
>
	<label class="form-label">
		Nom du produit
		<input
			class="form-input"
			type="text"
			name="name"
			maxlength="255"
			placeholder="Nom définitif"
			required
		/>
	</label>

	<label class="form-label">
		Prix
		<input
			class="form-input"
			type="number"
			name="price"
			min="1"
			step="1"
			placeholder="Prix (€)"
			required
		/>
	</label>

	<label class="form-label">
		Description
		<textarea name="description" cols="30" rows="10" class="form-input"></textarea>
	</label>

	<label class="form-label">
		Photo de garde
		<input type="file" accept="image/jpeg" class="form-input" name="photo" required />
	</label>

	<input type="hidden" name="photoId" bind:this={photoIdInput} />

	<label class="form-label">
		Type
		<select name="kind" class="form-input">
			<option value="armchair">Fauteuil</option>
			<option value="chair">Chaise</option>
			<option value="couch">Canapé</option>
			<option value="cushion">Coussin</option>
			<option value="tufting">Tufting</option>
		</select>
	</label>

	<label class="form-label">
		Prix de livraison (€)
		<input
			class="form-input"
			type="number"
			name="shippingPrice"
			min="0"
			step="0.01"
			placeholder="0.00"
			required
		/>
	</label>

	<label class="form-label flex items-center gap-2">
		<input type="checkbox" name="canGroupShipping" class="form-checkbox" />
		Peut être groupé avec d'autres articles (seuls les frais de port les plus élevés seront facturés)
	</label>

	{#if errorMessage}
		<p role="alert" class="text-red-700">{errorMessage}</p>
	{/if}

	<input type="submit" class="btn self-start mt-2" disabled={loading} />
</form>
