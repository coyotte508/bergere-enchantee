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
        pageData,
        pictures,
        origin: input.session.origin
      }
    };  
  };
</script>

<script lang="ts">
  import "../styles/styles.css";
  import "@unocss/reset/normalize.css";
  import "uno.css";
  import {page, navigating} from "$app/stores";
  import type { Page } from "$lib/db/page";
  import type { Picture } from "$lib/db/picture";
  import Container from "$lib/components/Container.svelte";
  import { useNProgress } from "$lib/nprogress";
  import { slide } from "svelte/transition";

  export let user: User;
  export let pageData: Page;
  export let pictures: Picture[];
  export let origin: string;

  let menuOpen = false;

  useNProgress();

  function upperFirst(s: string | undefined) {
    if (!s) {
      return undefined;
    }
    return s[0].toLocaleUpperCase() + s.slice(1);
  }

  $: shownPicture = pictures.find(p => p.storage[0].width >= p.storage[0].height) ?? pictures[0];
  $: path = $page.url.pathname;
  $: title = pageData?.name ?? upperFirst(path?.split("/")?.[1]);
  $: google = pageData?.text["google"];
  $: if (navigating) {
    menuOpen = false;
  }
</script>

<svelte:head>
  <meta property="og:site_name" content="Bergère Enchantée">
  {#key title}
    {#if title}
      <title>{title}</title>
      <meta property="og:title" content={title}>
    {/if}
    {#if google}
      <meta name="description" content={google} >
      <meta property="og:description" content={google}>
    {/if}
    <meta property="og:type" content="website" />
    {#if pictures.length > 0}
      <meta property="og:image" content="{origin}/photos/raw/{shownPicture.storage.slice(-2)[0]._id}">
      <meta name="twitter:card" content="{origin}/photos/raw/{shownPicture.storage[0]._id}">
    {/if}
    <meta property="og:url" content="{origin}{path}">
  {/key}
</svelte:head>

<header bg-oxford py-2 flex items-center style="font-family: Aileron">
  <nav bg-oxford text-xl font-bold flex grow px-2 sm:px-0 sm:text-center items-center text-white>
    <a href="/" grow><img src="/logo.svg" alt="Logo" title="Accueil" w-14 sm:w-18 md:w-24 lg:w-32></a>
    <a href="/atelier" class:text-sunray="{path === '/atelier'}" hidden sm:inline py-4 grow hover:text-sunray>L'atelier</a>
    <a href="/realisations" class:text-sunray="{path === '/realisations'}" hidden sm:inline py-4 grow hover:text-sunray>Réalisations</a>
    <a href="/vente" class:text-sunray="{path === '/vente'}" hidden sm:inline py-4 grow hover:text-sunray>e-shop</a>
    <a href="/tissus" class:text-sunray="{path === '/tissus'}" hidden sm:inline py-4 grow hover:text-sunray>Tissus / Finitions</a>
    <a href="/contact" class:text-sunray="{path === '/contact'}" hidden sm:inline py-4 grow hover:text-sunray>Contact</a>
    {#if user}
      <a href="/compte" title="Espace client" hidden sm:inline grow text-sunray text-3xl>
        <div inline-block class="i-ant-design-user-outlined"></div>
      </a>
    {:else}
      <a href="/connexion" title="Connexion" hidden sm:inline grow text-sunray text-3xl inline-block>
        <div inline-block class="i-ant-design-login-outlined"></div>
      </a>
    {/if}
    <div inline-flex flex-col justify-center sm:hidden class:text-white={!menuOpen} class:text-sunray={menuOpen} 
      cursor-pointer text-4xl class:rotate-90={menuOpen} transition on:click={() => menuOpen = !menuOpen}>
      <div inline-block class="i-ant-design-holder-outlined"></div>
    </div>
  </nav>
</header>

<main>
  {#if menuOpen}
    <nav bg-oxford flex flex-col transition:slide sm:hidden text-xl border-x-0 border-b-0 border-opacity-25 border-t-1 border-white font-bold items-center text-white>
      <a href="/" class:text-sunray="{path === '/'}" my-2 hover:text-sunray>Accueil</a>
      <a href="/atelier" class:text-sunray="{path === '/atelier'}" my-2 hover:text-sunray>L'atelier</a>
      <a href="/realisations" class:text-sunray="{path === '/realisations'}" my-2 hover:text-sunray>Réalisations</a>
      <a href="/vente" class:text-sunray="{path === '/vente'}" my-2 hover:text-sunray>e-shop</a>
      <a href="/tissus" class:text-sunray="{path === '/tissus'}" my-2 hover:text-sunray>Tissus / Finitions</a>
      <a href="/contact" class:text-sunray="{path === '/contact'}" my-2 hover:text-sunray>Contact</a>
      {#if user}
        <a href="/compte" title="Espace client" my-2 hover:text-sunray flex items-center justify-center>
          <div inline-block mr-2 class="i-ant-design-user-outlined"></div> Espace client 
        </a>
      {:else}
        <a href="/connexion" title="Connexion" my-2 hover:text-sunray flex items-center justify-center>
          <div inline-block mr-2 class="i-ant-design-login-outlined"></div> Connexion
        </a>
      {/if}
    </nav>
  {/if}

  {#if $page.url.searchParams.get("error")}
  <Container>
    <div class="border border-red-500 bg-red-300 rounded-lg pa-2">{$page.url.searchParams.get("error")}</div>
  </Container>
  {/if}

  <slot>  </slot>
</main>

{#if !path.startsWith("/admin/")}
<footer bg-oxford w-full h-sm relative overflow-x-hidden flex items-center justify-center>
  <img src="/logo-no-chair.svg" alt="Logo sans fauteuil" pointer-events-none absolute select-none opacity-50 md:opacity-100 left-0 top-0 bottom-0 style="transform: translate(-50%, 0);">
  <img src="/logo-no-chair.svg" alt="Logo sans fauteuil" pointer-events-none absolute select-none opacity-50 md:opacity-100 top-0 bottom-0 right-0 style="transform: translate(50%, 0);">

  <div text-white z-1 inline-block>
    <div flex justify-center>
      <a href="https://facebook.com/bergereenchantee" opacity-80 hover:opacity-100 style="width: 2rem; height: 2rem; padding: 0.35rem; padding-bottom: 0.25rem; padding-right: 0.3rem" bg-sunray rounded-full inline-block box-border mx-10>
        <div class="i-il-facebook" inline-block text-oxford w-full h-full>bergereenchantee</div>
      </a>
      <a href="https://instagram.com/bergereenchantee" opacity-80 hover:opacity-100 style="width: 2rem; height: 2rem; padding: 0.35rem; padding-bottom: 0.25rem; padding-right: 0.3rem" bg-sunray rounded-full inline-block box-border mx-10>
        <div class="i-il-instagram" inline-block text-oxford w-full h-full>bergereenchantee</div>
      </a>
      <a href="mailto:contact@bergereenchantee.fr" opacity-80 hover:opacity-100 style="width: 2rem; height: 2rem; padding: 0.35rem;  padding-right: 0.3rem" bg-sunray rounded-full inline-block box-border mx-10>
        <div class="i-ant-design-mail-outlined" inline-block text-oxford w-full h-full></div>
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
    grid-template-rows: min-content 1fr min-content;
  }
</style>