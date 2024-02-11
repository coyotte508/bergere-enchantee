<script lang="ts">
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import '../app.css';
	import '@fontsource/aileron/400.css';
	import '@fontsource/aileron/700.css';
	import type { LayoutData } from './$types';
	import { upperFirst } from '$lib/utils/upperFirst';
	import IconLogin from '~icons/ant-design/login-outlined';
	import IconUser from '~icons/ant-design/user-outlined';
	import IconCart from '~icons/ant-design/shopping-cart-outlined';
	import IconFacebook from '~icons/ant-design/facebook-filled';
	import IconInstagram from '~icons/ant-design/instagram-outlined';
	import IconEmail from '~icons/ant-design/mail-outlined';
	import IconMenu from '~icons/ant-design/holder-outlined';

	$: path = $page.route?.id ?? '';

	export let data: LayoutData;

	$: shownPicture =
		data.pictures.find((p) => p.storage.formats[0].width >= p.storage.formats[0].height) ??
		data.pictures[0];

	$: shownPictureFormat =
		shownPicture?.storage.formats.find((f) => f.width <= 1024 && f.height <= 1024) ?? null;

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
	{#if shownPicture && shownPictureFormat}
		<meta
			property="og:image"
			content="{$page.url.protocol}//{$page.url
				.host}/photos/raw/{shownPicture._id}/format/{shownPictureFormat.width}"
		/>
		<meta
			name="twitter:image"
			content="{$page.url.protocol}//{$page.url
				.host}/photos/raw/{shownPicture._id}/format/{shownPictureFormat.width}"
		/>
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
	<meta property="og:url" content="{$page.url.protocol}//{$page.url.host}{path}" />
	{#if $page.data.price}
		<meta property="product:price:amount" content={$page.data.price} />
		<meta property="product:price:currency" content="EUR" />
	{/if}
</svelte:head>

<header class="bg-oxford py-2 flex items-center font-aileron">
	<nav
		class="bg-oxford text-xl font-bold flex grow px-2 md:px-0 md:text-center items-center text-white"
	>
		<a href="/" style="line-height: 0;" class="grow"
			><img
				src="/logo.svg"
				alt="Logo"
				title="Accueil"
				class="h-14 w-14 sm:h-18 sm:w-18 md:h-24 md:w-24 lg:h-32 lg:w-32 inline"
			/></a
		>
		<a
			href="/atelier"
			class:text-sunray={path === '/atelier'}
			class="hidden md:inline py-4 grow hover:text-sunray">L'atelier</a
		>
		<a
			href="/realisations"
			class:text-sunray={path === '/realisations'}
			class="hidden md:inline py-4 grow hover:text-sunray">Réalisations</a
		>
		<a
			href="/e-shop"
			class:text-sunray={path === '/e-shop' || path.startsWith('/e-shop/')}
			class="hidden md:inline py-4 grow hover:text-sunray">E-shop</a
		>
		<a
			href="/tissus-et-finitions"
			class:text-sunray={path === '/tissus-et-finitions'}
			class="hidden py-4 md:inline grow hover:text-sunray">Tissus / Finitions</a
		>
		<a
			href="/tarifs"
			class:text-sunray={path === '/tarifs'}
			class="hidden md:inline py-4 grow hover:text-sunray">Tarifs</a
		>
		<a
			href="/contact"
			class:text-sunray={path === '/contact'}
			class="hidden md:inline py-4 grow hover:text-sunray">Contact</a
		>
		<div class="grow text-sunray text-3xl flex gap-4 items-center">
			<a href="/e-shop/panier" class="hidden md:flex items-center" title="Panier">
				<IconCart />
			</a>
			{#if data.user}
				<a href="/compte" class="hidden md:flex items-center" title="Espace client">
					<IconUser />
				</a>
			{:else}
				<a href="/connexion" class="hidden md:flex items-center" title="Connexion">
					<IconLogin />
				</a>
			{/if}
		</div>
		<button
			class="inline-flex flex-col justify-center md:hidden cursor-pointer text-4xl transition"
			class:text-white={!menuOpen}
			class:text-sunray={menuOpen}
			class:rotate-90={menuOpen}
			on:click={() => (menuOpen = !menuOpen)}
		>
			<IconMenu />
		</button>
	</nav>
</header>

<main>
	{#if menuOpen}
		<nav
			transition:slide
			class="bg-oxford flex flex-col md:hidden text-xl border-x-0 border-b-0 border-opacity-25 border-t-1 border-white font-bold items-center text-white"
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
			<a
				href="/e-shop"
				class:text-sunray={path === '/e-shop' || path.startsWith('/e-shop/')}
				class="my-2 hover:text-sunray">E-shop</a
			>
			<a
				href="/tissus-et-finitions"
				class:text-sunray={path === '/tissus'}
				class="my-2 hover:text-sunray">Tissus / Finitions</a
			>
			<a href="/tarifs" class:text-sunray={path === '/tarifs'} class="my-2 hover:text-sunray">
				Tarifs
			</a>
			<a href="/contact" class:text-sunray={path === '/contact'} class="my-2 hover:text-sunray"
				>Contact</a
			>
			<a
				href="/e-shop/panier"
				title="Panier"
				class:text-sunray={path === '/e-shop/panier'}
				class="my-2 hover:text-sunray flex items-center justify-center"
			>
				<IconCart class="inline-block mr-2" />
				Panier
			</a>
			{#if data.user}
				<a
					href="/compte"
					title="Espace client"
					class="my-2 hover:text-sunray flex items-center justify-center"
				>
					<IconUser class="inline-block mr-2" />
					Espace client
				</a>
			{:else}
				<a
					href="/connexion"
					title="Connexion"
					class="my-2 hover:text-sunray flex items-center justify-center"
				>
					<IconLogin class="inline-block mr-2" />
					Connexion
				</a>
			{/if}
		</nav>
	{/if}

	<slot />
</main>

{#if !path.startsWith('/admin/')}
	<footer
		class="bg-oxford w-full h-[24rem] relative overflow-x-hidden flex items-center justify-center"
	>
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
					title="Facebook: bergereenchantee"
					class="opacity-80 hover:opacity-100 bg-sunray rounded-full box-border inline-flex items-center mx-10"
					style="width: 2rem; height: 2rem; padding: 0.35rem; padding-bottom: 0.25rem; padding-right: 0.3rem"
				>
					<IconFacebook class="inline-block text-oxford w-full h-full" />
				</a>
				<a
					rel="external"
					href="https://instagram.com/bergereenchantee"
					title="Instagram: bergereenchantee"
					class="opacity-80 hover:opacity-100 bg-sunray rounded-full inline-flex items-center box-border mx-10"
					style="width: 2rem; height: 2rem; padding: 0.35rem; padding-bottom: 0.25rem; padding-right: 0.3rem"
				>
					<IconInstagram class="inline-block text-oxford w-full h-full" />
				</a>
				<a
					rel="external"
					href="mailto:contact@bergereenchantee.fr"
					class="opacity-80 hover:opacity-100 bg-sunray rounded-full inline-flex items-center box-border mx-10"
					style="width: 2rem; height: 2rem; padding: 0.35rem;  padding-right: 0.3rem"
				>
					<IconEmail class="inline-block text-oxford w-full h-full" />
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
				<a
					href="/e-shop"
					class:text-sunray={path === '/e-shop' || path.startsWith('/e-shop/')}
					class="hover:text-sunray">E-shop</a
				>
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
