<script lang="ts">
  import { page } from "$app/stores";
  import Container from "$lib/components/Container.svelte";

  const redirectUrl = $page.url.searchParams.get("suivant") ? decodeURIComponent($page.url.searchParams.get("suivant")) : "/";
</script>

<Container>
  <form method="post">
    <div my-4>
      <label for="email" text-sunray text-xl block>Email</label>
      <input type="email" input required name="email" id="email" placeholder="E-mail" block>
    </div>
    
    <div my-4>
      <label for="password" text-sunray text-xl block>Mot de passe</label>
      <input type="password" input required name="password" id="password" placeholder="Mot de passe">
    </div>

    <input type="hidden" name="redirect" value={redirectUrl} >

    <input type="submit" value="Connexion">
  </form>

  <p>Pour créer un compte, vous devez effectuer une commande au préalable.</p>

  <p>En cas de problème, envoyez-moi un courrier électronique à <a href="mailto:contact@bergereenchantee.fr" link>contact@bergereenchantee.fr</a>.</p>
</Container>