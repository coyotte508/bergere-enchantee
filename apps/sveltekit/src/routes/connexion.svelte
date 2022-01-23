<script lang="ts">

let form: HTMLFormElement;
let error = "";

async function submit() {
  const res = await fetch("/api/connexion", {method: "POST", body: new FormData(form)});

  if (!res.ok) {
    error = res.headers.get("content-type") === "application/json" ? await res.json().then(r => r.message) : "Erreur";
  }
}

</script>

{#if error}
  <div class="border border-red-500 bg-red-300 rounded-lg pa-2">Cet utilisateur n'existe pas</div>
{/if}

<form method="post" action="/api/connexion" on:submit|preventDefault={submit} bind:this={form}>
  <div my-4>
    <label for="email" text-sunray text-2xl block>Email</label>
    <input type="email" required name="email" id="email" placeholder="E-mail" block>
  </div>
  
  <div my-4>
    <label for="password" text-sunray text-2xl block>Mot de passe</label>
    <input type="password" required name="password" id="password" placeholder="Mot de passe">
  </div>

  <input type="submit" value="Connexion">
</form>

<p>Pour créer un compte, vous devez effectuer une commande au préalable.</p>

<p>En cas de problème, envoyez-moi un courrier électronique à <a href="mailto:contact@bergereenchantee.fr" text-brunswick>contact@bergereenchantee.fr</a>.</p>