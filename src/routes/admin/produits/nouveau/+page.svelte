<h1 class="text-sunray">Ajouter un produit</h1>

<form method="post" enctype="multipart/form-data" class="flex gap-4 flex-col">
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
		<input type="file" name="photo" accept="image/jpeg" class="form-input" required />
	</label>

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

	<input type="submit" class="btn self-start mt-2" />
</form>
