<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	const productId = $page.url.searchParams.get('productId');
</script>

<h1 class="text-sunray">Ajouter une photo</h1>

<form method="post" action="/admin/photos" enctype="multipart/form-data" use:enhance>
	<label class="block my-4 leading-8">
		Nom de la photo
		<input class="input block" type="text" name="name" placeholder="Nom définitif" required />
	</label>

	<label class="block my-4 leading-8">
		Fichier JPEG
		<input type="file" name="photo" accept="image/jpeg" class="block required" />
	</label>

	{#if productId}
		<p>Produit associé: <a href="/admin/produits/{productId}" class="link">{productId}</a></p>
	{/if}

	<input type="hidden" name="productId" value={productId || ''} />

	<input type="submit" hidden />
</form>
