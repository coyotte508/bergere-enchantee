<script lang="ts">
  import "../styles/styles.css";
  import "@unocss/reset/normalize.css";
  import "uno.css";
  import {page, session} from "$app/stores";
</script>


<header bg-oxford py-2 flex items-center style="font-family: Aileron">
  <nav bg-oxford text-xl font-bold flex grow text-center items-center text-white>
    <a href="/" grow><img src="/logo.svg" alt="Logo" title="Accueil" width="126" height="120"></a>
    <a href="/aterlier" py-4 text-center grow hover:text-sunray>L'atelier</a>
    <a href="/realisations" py-4 text-center grow hover:text-sunray>Réalisations</a>
    <a href="/vente" py-4 text-center grow hover:text-sunray>e-shop</a>
    <a href="/tissus" py-4 text-center grow hover:text-sunray>Tissus / Finitions</a>
    <a href="/contact" py-4 text-center grow hover:text-sunray>Contact</a>
    {#if $session.user}
    <form action="/deconnexion" method="post" text-sunray text-3xl inline-block cursor-pointer>
      <label class="i-ant-design-logout-outlined">
        <input type="submit" title="Déconnexion" opacity-0  cursor-pointer>
      </label>
    </form>
    {:else}
    <a href="/connexion" title="Connexion" text-center grow text-sunray text-3xl inline-block>
      <div inline-block class="i-ant-design-login-outlined"></div>
    </a>
    {/if}
  </nav>
</header>

<main pa-3 max-w-3xl mx-auto overflow-x-hidden>
  {#if $page.url.searchParams.get("error")}
    <div class="border border-red-500 bg-red-300 rounded-lg pa-2">{$page.url.searchParams.get("error")}</div>
  {/if}
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