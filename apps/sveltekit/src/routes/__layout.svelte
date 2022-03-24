<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit";
  import type { User } from "$lib/db/user";

  export const load: Load = async (input) => {
    const pageId = input.url.pathname;
    if (pageId.includes("page%25")) {
      // infinite loop
      return;
    }
    const pageFetch = await input.fetch(`/pages/${encodeURIComponent(pageId)}`);
    const pageData: Page | null = pageFetch.ok ? await pageFetch.json() : null;
    let pictures: Picture[] = [];
    if (pageData && Object.values(pageData.pictures ?? {}).filter(Boolean).length !== 0) {
      pictures = await (await input.fetch(`/photos?ids=${Object.values(pageData.pictures).filter(Boolean).join(",")}`, {headers: {accept: "application/json"}})).json();
    }

    return {
      stuff: {
        user: input.session.user,
        admin: input.session.user?.authority === "admin",
        pageData,
        pictures
      },
      props: {
        user: input.session.user,
        pageData
      }
    };  
  };
</script>

<script lang="ts">
  import "../styles/styles.css";
  import "@unocss/reset/normalize.css";
  import "uno.css";
  import {page} from "$app/stores";
  import type { Page } from "$lib/db/page";
  import type { Picture } from "$lib/db/picture";
  import Container from "$lib/components/Container.svelte";

  export let user: User;
  export let pageData: Page;

  $: path = $page.url.pathname;
</script>

<svelte:head>
  {#if pageData}
    <title>{pageData.name}</title>
  {/if}
</svelte:head>

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

{#if $page.url.searchParams.get("error")}
<Container>
  <div class="border border-red-500 bg-red-300 rounded-lg pa-2">{$page.url.searchParams.get("error")}</div>
</Container>
{/if}

<slot>  </slot>

{#if !path.startsWith("/admin/")}
<footer bg-oxford w-full h-sm relative overflow-x-hidden flex items-center justify-center>
  <img src="/logo-no-chair.svg" alt="Logo sans fauteuil" pointer-events-none absolute select-none left-0 top-0 bottom-0 style="transform: translate(-50%, 0);">
  <img src="/logo-no-chair.svg" alt="Logo sans fauteuil" pointer-events-none absolute select-none top-0 bottom-0 right-0 style="transform: translate(50%, 0);">

  <div text-white z-1 inline-block>
    <div flex justify-center>
      <a href="https://facebook.com/bergere.enchantee" opacity-80 hover:opacity-100 style="width: 2rem; height: 2rem; padding: 0.35rem; padding-bottom: 0.25rem; padding-right: 0.3rem" bg-sunray rounded-full inline-block box-border mx-10>
        <div class="i-il-facebook" inline-block text-oxford w-full h-full></div>
      </a>
      <a href="https://instagram.com/bergere.enchantee" opacity-80 hover:opacity-100 style="width: 2rem; height: 2rem; padding: 0.35rem; padding-bottom: 0.25rem; padding-right: 0.3rem" bg-sunray rounded-full inline-block box-border mx-10>
        <div class="i-il-instagram" inline-block text-oxford w-full h-full>bergere.enchantee</div>
      </a>
      <a href="https://pinterest.com/bergere.enchantee" opacity-80 hover:opacity-100 style="width: 2rem; height: 2rem; padding: 0.35rem; padding-bottom: 0.25rem; padding-right: 0.3rem" bg-sunray rounded-full inline-block box-border mx-10>
        <div class="i-il-pin" inline-block text-oxford w-full h-full>bergere.enchantee</div>
      </a>
    </div>
    <div my-14>
      <a href="/" class:text-sunray="{path === '/'}" hover:text-sunray>Acceuil</a> | 
      <a href="/atelier" class:text-sunray="{path === '/atelier'}" hover:text-sunray>L'atelier</a> | 
      <a href="/realisations" class:text-sunray="{path === '/realisations'}" hover:text-sunray>Réalisations</a> | 
      <a href="/vente" class:text-sunray="{path === '/vente'}" hover:text-sunray>E-shop</a> | 
      <a href="/tissus" class:text-sunray="{path === '/tissus'}" hover:text-sunray>Tissus / Finitions</a> | 
      <a href="/contact" class:text-sunray="{path === '/contact'}" hover:text-sunray>Contact</a>
    </div>
    <div text-center>
      <a rel="external" href="https://www.sentinellesduweb.com" hover:underline>Les Sentinelles du Web</a> / <a rel="external" href="https://coyo.dev" hover:underline>Coyotech</a> © 2022 - Tous droits réservés
    </div>
  </div>
</footer>
{/if}

<style global>
  body {
    display: grid;
    grid-template-rows: min-content min-content 1fr min-content;
  }
</style>