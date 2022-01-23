<script lang="ts">
  import "../styles/styles.css";
  import "@unocss/reset/normalize.css";
  import "uno.css";

</script>


<header bg-oxford py-2 px-2 flex items-center style="font-family: Aileron">
  <h1 text-sunray >La bergère enchantée</h1>
  <a href="/connexion" title="Connexion" text-sunray text-3xl ml-auto inline-block> <div class="i-ant-design-login-outlined"></div></a>
</header>
<nav bg-oxford text-xl font-bold flex justify-around items-center text-white>
  <a href="/" py-4 text-center flex-grow hover:text-sunray>L'atelier</a>
  <a href="/realisations" py-4 text-center flex-grow hover:text-sunray>Réalisations</a>
  <a href="/vente" py-4 text-center flex-grow hover:text-sunray>e-shop</a>
  <a href="/tissus" py-4 text-center flex-grow hover:text-sunray>Tissus / Finitions</a>
  <a href="/contact" py-4 text-center flex-grow hover:text-sunray>Contact</a>
</nav>
<main pa-3 max-w-3xl mx-auto overflow-x-hidden>
<slot>  </slot>
</main>
<!-- <footer flex justify-around items-center text-center text-sunray>
  <a py-2 flex-grow href="mailto:contact@bergerenchantee.fr" bg-oxford opacity-40 hover:opacity-100 hover:transition-all>Contact</a>
  <a py-2 flex-grow href="https://coyo.dev" bg-oxford opacity-40 hover:opacity-100 hover:transition-all>Créateur</a>
</footer> -->

<style global>
  body {
    display: grid;
    grid-template-rows: min-content min-content 1fr min-content;
  }
</style>