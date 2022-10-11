
<h1 text-sunray>Ajouter un produit</h1>

<form method="post" enctype="multipart/form-data" action="/admin/produits">
  <label block my-4 leading-8>
    Nom du produit
    <input input type="text" name="name" block placeholder="Nom définitif" required>
  </label>

  <label block my-4 leading-8>
    Prix
    <input input type="number" name="price" block placeholder="Prix (€)" required>
  </label>

  <label block w-full mt-4>
    Description
    <textarea name="description" cols="30" rows="10" block w-full></textarea>
  </label>

  <label block my-4 leading-8>
    Photo de garde
    <input type="file" name="photo" accept="image/jpeg" block required>
  </label>

  <label block my-4 leading-8>
    Type
    <select name="kind">
      <option value="armchair">Fauteuil</option>
      <option value="chair">Chaise</option>
      <option value="couch">Canapé</option>
      <option value="cushion">Coussin</option>
      <option value="tufting">Tufting</option>
    </select>
  </label>

  <input type="submit">
</form>