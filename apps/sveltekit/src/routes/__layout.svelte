<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";
  import type { User } from "$lib/db/user";

  export interface Stuff {
    user: User;
    admin: boolean;
  }

  export function load (input: LoadInput): LoadOutput {
    return {
      stuff: {
        user: input.session.user,
        admin: input.session.user?.authority === "admin"
      },
      props: {
        user: input.session.user
      }
    };  
  }
</script>

<script lang="ts">
  import "../styles/styles.css";
  import "@unocss/reset/normalize.css";
  import "uno.css";
  import {page} from "$app/stores";

  export let user: User;

  const path = $page.url.pathname;
</script>


<header bg-oxford py-2 flex items-center style="font-family: Aileron">
  <nav bg-oxford text-xl font-bold flex grow text-center items-center text-white>
    <a href="/" grow><img src="/logo.svg" alt="Logo" title="Accueil" width="126" height="120"></a>
    <a href="/atelier" class:text-sunray="{path === '/atelier'}" py-4 text-center grow hover:text-sunray>L'atelier</a>
    <a href="/realisations" class:text-sunray="{path === '/realisations'}" py-4 text-center grow hover:text-sunray>Réalisations</a>
    <a href="/vente" class:text-sunray="{path === '/vente'}" py-4 text-center grow hover:text-sunray>e-shop</a>
    <a href="/tissus" class:text-sunray="{path === '/tissus'}" py-4 text-center grow hover:text-sunray>Tissus / Finitions</a>
    <a href="/contact" class:text-sunray="{path === '/contact'}" py-4 text-center grow hover:text-sunray>Contact</a>
    {#if user}
      <a href="/compte" title="Compte" text-center grow text-sunray text-3xl>
        <div inline-block class="i-ant-design-user-outlined"></div>
      </a>
    {:else}
      <a href="/connexion" title="Connexion" text-center grow text-sunray text-3xl inline-block>
        <div inline-block class="i-ant-design-login-outlined"></div>
      </a>
    {/if}
  </nav>
</header>

<main pa-3 max-w-3xl w-full mx-auto overflow-x-hidden>
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