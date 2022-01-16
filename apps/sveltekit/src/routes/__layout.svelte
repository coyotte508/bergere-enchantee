<script lang="ts">
  import "../styles/styles.css";
  import "@unocss/reset/normalize.css";
  import "uno.css";

</script>


<header bg-oxford py-2 px-2 style="font-family: Aileron">
  <h1 text-sunray >La bergère enchantée</h1>
</header>
<nav bg-brunswick flex justify-around items-center text-white>
  <a href="/" py-4 text-center flex-grow hover:text-sunray>Accueil</a>
  <a href="/restauration" py-4 text-center flex-grow hover:text-sunray>Restauration</a>
  <a href="/catalogue" py-4 text-center flex-grow hover:text-sunray>Catalogue</a>
  <a href="/tissus" py-4 text-center flex-grow hover:text-sunray>Tissus</a>
  <a href="/finitions" py-4 text-center flex-grow hover:text-sunray>Finitions</a>
</nav>
<main >
<slot>  </slot>
</main>
<footer flex justify-around items-center>
  <a text-sunray py-2 flex-grow text-center href="mailto:contact@bergerenchantee.fr" bg-oxford opacity-40 hover:opacity-100 hover:transition-all>Contact</a>
  <a text-sunray py-2 flex-grow text-center href="https://coyo.dev" bg-oxford opacity-40 hover:opacity-100 hover:transition-all>Créateur</a>
</footer>

<style global>
  body {
    display: grid;
    grid-template-rows: min-content min-content 1fr min-content;
  }
</style>