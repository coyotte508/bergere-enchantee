<h1 class="text-sunray">Ajouter un produit</h1>

<form method="post" enctype="multipart/form-data" action="/admin/produits">
	<label class="block my-4 leading-8">
		Nom du produit
		<input class="input block" type="text" name="name" placeholder="Nom définitif" required />
	</label>

	<label class="block my-4 leading-8">
		Prix
		<input class="input block" type="number" name="price" placeholder="Prix (€)" required />
	</label>

	<label class="block w-full mt-4">
		Description
		<textarea name="description" cols="30" rows="10" class="block w-full" />
	</label>

	<label class="block my-4 leading-8">
		Photo de garde
		<input type="file" name="photo" accept="image/jpeg" class="block" required />
	</label>

	<label class="block my-4 leading-8">
		Type
		<select name="kind">
			<option value="armchair">Fauteuil</option>
			<option value="chair">Chaise</option>
			<option value="couch">Canapé</option>
			<option value="cushion">Coussin</option>
			<option value="tufting">Tufting</option>
		</select>
	</label>

	<input type="submit" class="btn" />
</form>
