<script lang="ts">
	import { tick } from 'svelte';

	let formInput: HTMLFormElement | null = null;
	let fileInput: HTMLInputElement | null = null;
	let photoIdInput: HTMLInputElement | null = null;

	let loading = false;

	async function submit(event: Event) {
		event.preventDefault();

		loading = true;
		try {
			const file = fileInput?.files?.[0];

			if (!file) {
				alert('Veuillez sélectionner un fichier');
				return;
			}

			const response = await fetch('/admin/fichiers', {
				method: 'POST',
				body: JSON.stringify({
					name,
					mimeType: file.type,
					file: fileInput?.files?.[0],
					size: file.size,
				}),
			});

			if (!response.ok) {
				alert("Erreur lors de l'envoi du fichier" + (await response.text()));
				loading = false;
				return;
			}

			const { _id, url } = await response.json();

			const response2 = await fetch(url, {
				method: 'PUT',
				body: file,
			});

			if (!response2.ok) {
				alert("Erreur lors de l'envoi du fichier" + (await response2.text()));
				loading = false;
				return;
			}

			if (photoIdInput) {
				photoIdInput.value = _id;
			}

			await tick();

			formInput?.submit();
		} finally {
			loading = false;
		}
	}
</script>

<h1 class="text-sunray">Ajouter un produit</h1>

<form
	method="post"
	enctype="multipart/form-data"
	class="flex gap-4 flex-col"
	bind:this={formInput}
	on:submit|preventDefault={submit}
>
	<label class="form-label">
		Nom du produit
		<input class="form-input" type="text" name="name" placeholder="Nom définitif" required />
	</label>

	<label class="form-label">
		Prix
		<input class="form-input" type="number" name="price" placeholder="Prix (€)" required />
	</label>

	<label class="form-label">
		Description
		<textarea name="description" cols="30" rows="10" class="form-input" />
	</label>

	<label class="form-label">
		Photo de garde
		<input
			type="file"
			name="photo"
			accept="image/jpeg"
			class="form-input"
			bind:this={fileInput}
			required
		/>
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

	<input type="submit" class="btn self-start mt-2" disabled={loading} />
</form>
