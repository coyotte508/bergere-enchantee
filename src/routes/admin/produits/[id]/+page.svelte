<script lang="ts">
	import PictureComponent from '$lib/components/Picture.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="text-sunray">Modifier un produit</h1>

<div class="flex flex-col">
	<form method="post" action="?/update">
		<label class="block w-full mt-4 leading-8">
			Nom
			<input type="text" name="name" class="input block" value={data.product.name} />
		</label>
		<label class="block w-full mt-4 leading-8">
			Prix
			<input type="number" name="price" class="input block" value={data.product.price} />
		</label>
		<label class="block w-full mt-4 leading-8">
			Etat
			<select name="state" value={data.product.state} class="block input">
				<option value="draft" selected={data.product.state === 'draft'}>Privé</option>
				<option value="published" selected={data.product.state === 'published'}>Public</option>
				<option value="retired" selected={data.product.state === 'retired'}>Vendu</option>
			</select>
		</label>
		<label class="block w-full mt-4 leading-8">
			Type

			<select name="kind" value={data.product.kind} class="block input">
				<option value="armchair" selected={data.product.kind === 'armchair'}>Fauteuil</option>
				<option value="chair" selected={data.product.kind === 'chair'}>Chaise</option>
				<option value="couch" selected={data.product.kind === 'couch'}>Canapé</option>
				<option value="cushion" selected={data.product.kind === 'cushion'}>Coussin</option>
				<option value="tufting" selected={data.product.kind === 'tufting'}>Tufting</option>
			</select>
		</label>

		<label class="block my-4 w-full">
			Description
			<textarea name="description" cols="30" rows="10" class="block input"
				>{data.product.description}</textarea
			>
		</label>

		<button type="submit" class="mt-4 btn">Valider</button>
		<button type="submit" class="mt-4 btn-red float-right" formaction="?/delete">Supprimer</button>
	</form>
</div>

<h2 class="text-sunray my-4">Photos</h2>

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
