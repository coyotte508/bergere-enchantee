<h1 text-sunray>Ajouter une photo</h1>

<form method="post" enctype="multipart/form-data">
  <label block my-4 leading-8>
    Nom de la photo
    <input type="text" name="name" block placeholder="Pas de faute d'orthographes" required>
  </label>

  <label block my-4 leading-8>
    Fichier JPEG
    <input type="file" name="photo" accept="image/jpeg" block required>
  </label>

  <input type="submit" hidden>
</form>