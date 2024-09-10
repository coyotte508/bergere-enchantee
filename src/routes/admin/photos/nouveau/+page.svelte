<script lang="ts">
	import { page } from '$app/stores';

	const productId = $page.url.searchParams.get('productId');

	let photoIdInput: HTMLInputElement | null = null;
	let fileInput: HTMLInputElement | null = null;
	let formInput: HTMLFormElement | null = null;

	let name: string = '';

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
				}),
			});

			if (!response.ok) {
				alert("Erreur lors de l'envoi du fichier");
				loading = false;
				return;
			}

			const { _id, url } = await response.json();

			const response2 = await fetch(url, {
				method: 'PUT',
				body: file,
			});

			if (!response2.ok) {
				alert("Erreur lors de l'envoi du fichier");
				loading = false;
				return;
			}

			if (photoIdInput) {
				photoIdInput.value = _id;
			}

			formInput?.submit();
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
			bind:value={name}
			required
		/>
	</label>

	<label class="form-label">
		Fichier JPEG
		<input type="file" bind:this={fileInput} accept="image/jpeg" class="form-input" required />
	</label>

	{#if productId}
		<p>Produit associé: <a href="/admin/produits/{productId}" class="link">{productId}</a></p>
	{/if}

	<input type="hidden" name="productId" value={productId || ''} />
	<input type="hidden" name="photoId" bind:this={photoIdInput} />

	<input type="submit" class="btn self-start" disabled={loading} />
</form>
