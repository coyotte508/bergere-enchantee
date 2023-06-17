<script lang="ts">
	import type { ContactPage } from '$lib/types/Page';
	import Container from '$lib/components/Container.svelte';
	import { marked } from 'marked';
	import Picture from '$lib/components/Picture.svelte';
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import IconPhone from '~icons/ant-design/phone-outlined';
	import IconMail from '~icons/ant-design/mail-outlined';
	import IconClock from '~icons/ant-design/clock-circle-outlined';

	export let data: PageData;

	const pageData: ContactPage = data.pageData as ContactPage;
	const pictures = data.pictures;

	export let form: ActionData;
</script>

<Container class="mb-6">
	<section class="relative lg:h-[36rem] mt-12 flex">
		<img
			src="/triangles.svg"
			alt="Triangles"
			class="pointer-events-none select-none absolute hidden lg:block h-5/6"
			style="left: 50%; top: 50%; transform: translate(-50%, -50%) scaleX(-1); z-index: -1"
		/>
		<Picture
			picture={pictures.find((p) => p._id === pageData.pictures['photo-garde'])}
			sizes="(max-width: 1200px) 50vw, 600px"
			grow
			basis-0
			hidden
			class="rounded-3xl h-full object-cover w-3/6 lg:block"
		/>
		<div class="lg:w-3/6 h-full flex flex-col justify-evenly lg:pl-12">
			<h2 class="text-oxford text-7xl mb-7 lg:mb-0" style="mix-blend-mode: color-burn;">Contact</h2>
			<ul class="text-oxford">
				<li class="flex items-center">
					<IconPhone class="inline-block mr-2" />
					<a rel="external" href="tel:+33774521115">07 74 52 11 15</a>
				</li>
				<li class="flex items-center mt-2">
					<IconMail class="inline-block mr-2" />
					<a rel="external" href="mailto:contact@bergereenchantee.fr">contact@bergereenchantee.fr</a
					>
				</li>
				<li class="flex mt-2">
					<IconClock class="inline-block mr-2" />
					Le lundi mardi jeudi vendredi de 9h à 17h30 et le mercredi de 9h à 12h
				</li>
			</ul>
		</div>
	</section>
	<div class="pt-3 marked">
		{@html marked(pageData.text.description)}
	</div>

	{#if form?.success}
		<div class="border border-blue-500 bg-blue-300 rounded-lg p-2">
			Votre message a bien été envoyé. <br /><br /> Daphné vous répondra rapidement.
		</div>
	{:else}
		<form method="post" class="text-oxford font-semibold text-lg" use:enhance>
			<div class="mt-4">
				<label for="lastName" class="block">Nom</label>
				<input
					type="text"
					name="lastName"
					id="lastName"
					placeholder="Nom"
					class="input box-border"
					style="max-width: 100% !important"
					required
				/>
			</div>

			<div class="mt-4">
				<label for="firstName" class="block">Prénom</label>
				<input
					type="text"
					name="firstName"
					id="firstName"
					placeholder="Prénom"
					class="input box-border"
					style="max-width: 100% !important"
					required
				/>
			</div>

			<div class="mt-4">
				<label for="email" class="block">Mail</label>
				<input
					type="email"
					name="email"
					id="email"
					placeholder="Adresse mail"
					class="input box-border"
					style="max-width: 100% !important"
					required
				/>
			</div>

			<div class="mt-4">
				<label for="message" class="block">Message</label>
				<textarea
					name="message"
					id="message"
					cols="30"
					rows="5"
					class="input box-border"
					style="max-width: 100% !important"
					placeholder="Votre message"
					required
				/>
			</div>

			<div class="w-full flex mt-4">
				<button type="submit" class="btn ml-auto"> Envoyer </button>
			</div>
		</form>
	{/if}
</Container>
