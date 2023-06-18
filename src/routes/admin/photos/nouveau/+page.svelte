<script lang="ts">
	import { page } from '$app/stores';

	const productId = $page.url.searchParams.get('productId');
</script>

<h1 class="text-sunray">Ajouter une photo</h1>

<form method="post" enctype="multipart/form-data" class="flex flex-col gap-6">
	<label class="form-label">
		Nom de la photo
		<input class="form-input" type="text" name="name" placeholder="Nom définitif" required />
	</label>

	<label class="form-label">
		Fichier JPEG
		<input type="file" name="photo" accept="image/jpeg" class="form-input" required />
	</label>

	{#if productId}
		<p>Produit associé: <a href="/admin/produits/{productId}" class="link">{productId}</a></p>
	{/if}

	<input type="hidden" name="productId" value={productId || ''} />

	<input type="submit" class="btn self-start" />
</form>
