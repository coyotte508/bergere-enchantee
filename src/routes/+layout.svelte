<script lang="ts">
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import '@unocss/reset/normalize.css';
	import 'uno.css';
	import type { LayoutData } from './$types';
	import { upperFirst } from '$lib/utils/upperFirst';

	$: path = $page.route?.id ?? '';

	export let data: LayoutData;

	$: shownPicture =
		data.pictures.find((p) => p.storage[0].width >= p.storage[0].height) ?? data.pictures[0];

	let menuOpen = false;
	let date = new Date();

	$: title = $page.data.title ?? data.pageData?.name ?? upperFirst(path?.split('/')?.[1]);
	$: description = $page.data.description ?? data.pageData?.text['search-engine-description'];
</script>

<svelte:head>
	<meta property="og:site_name" content="Bergère Enchantée" />
	{#if title}
		<title>{title}</title>
		<meta property="og:title" content={title} />
		<meta property="twitter:title" content={title} />
	{/if}
	{#if description}
		<meta name="description" content={description} />
		<meta property="og:description" content={description} />
		<meta property="twitter:description" content={description} />
	{/if}
	<meta property="og:type" content={$page.data.type || 'website'} />
	{#if shownPicture}
		<meta
			property="og:image"
			content="{$page.url.protocol}//{$page.url.host}/photos/raw/{shownPicture.storage.slice(-2)[0]
				._id}"
		/>
		<meta
			name="twitter:image"
			content="{$page.url.protocol}//{$page.url.host}/photos/raw/{shownPicture.storage[0]._id}"
		/>
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
	<meta property="og:url" content="{$page.url.protocol}//{$page.url.host}{path}" />
	{#if $page.data.price}
		<meta property="product:price:amount" content={$page.data.price} />
		<meta property="product:price:currency" content="EUR" />
	{/if}
</svelte:head>

<header class="bg-oxford py-2 flex items-center" style="font-family: Aileron">
	<nav
		class="bg-oxford text-xl font-bold flex grow px-2 sm:px-0 sm:text-center items-center text-white"
	>
		<a href="/" style="line-height: 0;" class="grow"
			><img
				src="/logo.svg"
				alt="Logo"
				title="Accueil"
				class="h-14 w-14 sm:h-18 sm:w-18 md:h-24 md:w-24 lg:h-32 lg:w-32"
			/></a
		>
		<a
			href="/atelier"
			class:text-sunray={path === '/atelier'}
			class="hidden sm:inline py-4 grow hover:text-sunray">L'atelier</a
		>
		<a
			href="/realisations"
			class:text-sunray={path === '/realisations'}
			class="hidden sm:inline py-4 grow hover:text-sunray">Réalisations</a
		>
		<a
			href="/vente"
			class:text-sunray={path === '/vente'}
			class="hidden sm:inline py-4 grow hover:text-sunray">e-shop</a
		>
		<a
			href="/tissus-et-finitions"
			class:text-sunray={path === '/tissus-et-finitions'}
			class="hidden py-4 sm:inline grow hover:text-sunray">Tissus / Finitions</a
		>
		<a
			href="/contact"
			class:text-sunray={path === '/contact'}
			class="hidden sm:inline py-4 grow hover:text-sunray">Contact</a
		>
		{#if data.user}
			<a href="/compte" title="Espace client" class="hidden sm:inline grow text-sunray text-3xl">
				<div class="inline-block i-ant-design-user-outlined" />
			</a>
		{:else}
			<a
				href="/connexion"
				title="Connexion"
				class="hidden sm:inline grow text-sunray text-3xl inline-block"
			>
				<div class="inline-block i-ant-design-login-outlined" />
			</a>
		{/if}
		<button
			class="inline-flex flex-col justify-center sm:hidden cursor-pointer text-4xl transition"
			class:text-white={!menuOpen}
			class:text-sunray={menuOpen}
			class:rotate-90={menuOpen}
			on:click={() => (menuOpen = !menuOpen)}
		>
			<div class="inline-block i-ant-design-holder-outlined" />
		</button>
	</nav>
</header>

<main>
	{#if menuOpen}
		<nav
			transition:slide
			class="bg-oxford flex flex-col sm:hidden text-xl border-x-0 border-b-0 border-opacity-25 border-t-1 border-white font-bold items-center text-white"
		>
			<a href="/" class:text-sunray={path === '/'} class="my-2 hover:text-sunray">Accueil</a>
			<a href="/atelier" class:text-sunray={path === '/atelier'} class="my-2 hover:text-sunray"
				>L'atelier</a
			>
			<a
				href="/realisations"
				class:text-sunray={path === '/realisations'}
				class="my-2 hover:text-sunray">Réalisations</a
			>
			<a href="/vente" class:text-sunray={path === '/vente'} class="my-2 hover:text-sunray"
				>e-shop</a
			>
			<a
				href="/tissus-et-finitions"
				class:text-sunray={path === '/tissus'}
				class="my-2 hover:text-sunray">Tissus / Finitions</a
			>
			<a href="/contact" class:text-sunray={path === '/contact'} class="my-2 hover:text-sunray"
				>Contact</a
			>
			{#if data.user}
				<a
					href="/compte"
					title="Espace client"
					class="my-2 hover:text-sunray flex items-center justify-center"
				>
					<div class="inline-block mr-2 i-ant-design-user-outlined" />
					Espace client
				</a>
			{:else}
				<a
					href="/connexion"
					title="Connexion"
					class="my-2 hover:text-sunray flex items-center justify-center"
				>
					<div class="inline-block mr-2 i-ant-design-login-outlined" />
					Connexion
				</a>
			{/if}
		</nav>
	{/if}

	<slot />
</main>

{#if !path.startsWith('/admin/')}
	<footer class="bg-oxford w-full h-sm relative overflow-x-hidden flex items-center justify-center">
		<img
			src="/logo-no-chair.svg"
			alt="Logo sans fauteuil"
			class="pointer-events-none absolute select-none opacity-50 md:opacity-100 left-0 top-0 bottom-0"
			style="transform: translate(-50%, 0);"
		/>
		<img
			src="/logo-no-chair.svg"
			alt="Logo sans fauteuil"
			class="pointer-events-none absolute select-none opacity-50 md:opacity-100 top-0 bottom-0 right-0"
			style="transform: translate(50%, 0);"
		/>

		<div class="text-white z-1 inline-block">
			<div class="flex justify-center">
				<a
					rel="external"
					href="https://facebook.com/bergereenchantee"
					class="opacity-80 hover:opacity-100 bg-sunray rounded-full box-border inline-block mx-10"
					style="width: 2rem; height: 2rem; padding: 0.35rem; padding-bottom: 0.25rem; padding-right: 0.3rem"
				>
					<div class="i-il-facebook inline-block text-oxford w-full h-full">bergereenchantee</div>
				</a>
				<a
					rel="external"
					href="https://instagram.com/bergereenchantee"
					class="opacity-80 hover:opacity-100 bg-sunray rounded-full inline-block box-border mx-10"
					style="width: 2rem; height: 2rem; padding: 0.35rem; padding-bottom: 0.25rem; padding-right: 0.3rem"
				>
					<div class="i-il-instagram inline-block text-oxford w-full h-full">bergereenchantee</div>
				</a>
				<a
					rel="external"
					href="mailto:contact@bergereenchantee.fr"
					class="opacity-80 hover:opacity-100 bg-sunray rounded-full inline-block box-border mx-10"
					style="width: 2rem; height: 2rem; padding: 0.35rem;  padding-right: 0.3rem"
				>
					<div class="i-ant-design-mail-outlined inline-block text-oxford w-full h-full" />
				</a>
			</div>
			<div class="my-14">
				<a href="/" class:text-sunray={path === '/'} class="hover:text-sunray">Accueil</a> |
				<a href="/atelier" class:text-sunray={path === '/atelier'} class="hover:text-sunray"
					>L'atelier</a
				>
				|
				<a
					href="/realisations"
					class:text-sunray={path === '/realisations'}
					class="hover:text-sunray">Réalisations</a
				>
				|
				<a href="/vente" class:text-sunray={path === '/vente'} class="hover:text-sunray">E-shop</a>
				|
				<a
					href="/tissus-et-finitions"
					class:text-sunray={path === '/tissus-et-finitions'}
					class="hover:text-sunray">Tissus / Finitions</a
				>
				|
				<a href="/contact" class:text-sunray={path === '/contact'} class="hover:text-sunray"
					>Contact</a
				>
			</div>
			<div class="text-center">
				<a rel="external" href="https://www.sentinellesduweb.com" class="hover:underline"
					>Les Sentinelles du Web</a
				>
				/ <a rel="external" href="https://coyo.dev" class="hover:underline">Coyotech</a> © {date.getFullYear()}
				- Tous droits réservés
			</div>
		</div>
	</footer>
{/if}

<style global>
	body,
	html {
		margin: 0;
		padding: 0;
		height: 100%;
		font-family: 'Gotham', sans-serif;
		scroll-behavior: smooth;

		--sunray: #d3a95a;
	}

	body {
		display: grid;
		grid-template-rows: min-content 1fr min-content;
	}

	a {
		color: unset;
		text-decoration: none;
	}

	h1,
	h2,
	h3 {
		font-family: 'RiotSquad', serif;
		margin: 0;
	}

	nav {
		font-family: 'Aileron', sans-serif;
		margin: 0;
	}

	ol,
	ul {
		padding: 0;
		margin: 0;
	}

	li {
		list-style-type: none;
	}

	@font-face {
		font-family: 'Aileron';
		src: url(/Ailerons-Typeface.otf) format('opentype');
	}

	@font-face {
		font-family: 'RiotSquad';
		src: url('/RIOTSQUA.ttf') format('truetype');
		font-weight: normal;
		font-style: normal;
	}

	/*
@font-face {
  font-family: "Raleway";
  src: url(/Raleway-VariableFont_wght.ttf) format("truetype");
}

@font-face {
  font-family: "Raleway";
  font-style: italic;
  src: url(/Raleway-Italic-VariableFont_wght.ttf) format("truetype");
}
*/

	@font-face {
		font-family: 'Gotham';
		font-weight: 400;
		src: url(/GothamBook.ttf) format('truetype');
	}

	@font-face {
		font-family: 'Gotham';
		font-weight: 700;
		src: url(/GothamBold.ttf) format('truetype');
	}

	.drop-white {
		filter: drop-shadow(2px 2px 2px white);
	}

	.marked ul li {
		margin-left: 1.5rem;
		list-style-type: disc;
	}

	.h-full-without-banner {
		height: calc(100vh - 1rem - (14rem / 4));
	}

	@media (min-width: 640px) {
		.h-full-without-banner {
			height: calc(100vh - 1rem - (18rem / 4));
		}
	}
	@media (min-width: 768px) {
		.h-full-without-banner {
			height: calc(100vh - 1rem - (24rem / 4));
		}
	}
	@media (min-width: 1024px) {
		.h-full-without-banner {
			height: calc(100vh - 1rem - (32rem / 4));
		}
	}

	select.input {
		cursor: pointer;
	}

	textarea.input {
		max-width: calc(100% - 1rem);
	}

	/*
@media (min-width: 1280px) { ... }
@media (min-width: 1536px) { ... }
*/
</style>
