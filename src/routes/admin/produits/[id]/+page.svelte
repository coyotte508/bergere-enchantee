<script lang="ts">
	import PictureComponent from '$lib/components/Picture.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="text-sunray">Modifier un produit</h1>

<form method="post" action="?/update" class="flex flex-col gap-4">
	<label class="form-label">
		Nom
		<input type="text" name="name" class="form-input" value={data.product.name} />
	</label>
	<label class="form-label">
		Prix
		<input type="number" name="price" class="form-input" value={data.product.price} />
	</label>
	<label class="form-label">
		Stock
		<input type="number" name="stock" class="form-input" value={data.product.stock} />
	</label>
	<label class="form-label">
		Etat
		<select name="state" value={data.product.state} class="form-input">
			<option value="draft" selected={data.product.state === 'draft'}>Privé</option>
			<option value="published" selected={data.product.state === 'published'}>Public</option>
		</select>
	</label>
	<label class="form-label">
		Type

		<select name="kind" value={data.product.kind} class="form-input">
			<option value="armchair" selected={data.product.kind === 'armchair'}>Fauteuil</option>
			<option value="chair" selected={data.product.kind === 'chair'}>Chaise</option>
			<option value="couch" selected={data.product.kind === 'couch'}>Canapé</option>
			<option value="cushion" selected={data.product.kind === 'cushion'}>Coussin</option>
			<option value="tufting" selected={data.product.kind === 'tufting'}>Tufting</option>
		</select>
	</label>

	<label class="form-label">
		Description
		<textarea name="description" cols="30" rows="10" class="block form-input"
			>{data.product.description}</textarea
		>
	</label>

	<div class="flex justify-between">
		<button type="submit" class="btn">Valider</button>
		<button type="submit" class="btn-red" formaction="?/delete">Supprimer</button>
	</div>
</form>

<h2 class="text-sunray text-2xl mt-6">Photos</h2>

<a href="/admin/photos/nouveau?productId={data.product._id}" class="link">Nouvelle photo</a>

<div class="flex flex-row flex-wrap gap-6 mt-6">
	{#each data.product.photos as photo}
		<div class="flex flex-col text-center">
			<a href="/admin/photos/{photo._id}" class="flex flex-col items-center">
				<PictureComponent picture={photo} class="h-36 block" style="object-fit: scale-down;" />
				<span>{photo.name}</span>
			</a>
		</div>
	{/each}
</div>
