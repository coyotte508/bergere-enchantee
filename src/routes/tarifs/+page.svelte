<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Picture from '$lib/components/Picture.svelte';
	import type { PricingPage } from '$lib/types/Page.js';
	import { byKeyIndex } from '$lib/utils/keyIndex';
	import { typedKeys } from '$lib/utils/typedKeys';

	let { data } = $props();

	const pictures = $derived(data.pictures);
	const pageData = $derived(data.pageData as PricingPage);
	const text = $derived(pageData.text as Record<string, string | undefined>);
	const pics = $derived(pageData.pictures as Record<string, string | null | undefined>);

	const currentYear = new Date().getFullYear();

	const disclaimer = $derived({
		title: text['pricing-disclaimer-title'],
		excluded: [
			text['pricing-disclaimer-fabric'],
			text['pricing-disclaimer-finishing'],
			text['pricing-disclaimer-supplies'],
		].filter((value): value is string => !!value),
		note: text['pricing-disclaimer-note'],
	});

	// Each catalogue entry gathers its photo, title and detail lines from the
	// `tarif-N` / `tarif-N-titre` / `tarif-N-details` keys.
	const items = $derived.by(() => {
		const keys = new Set<string>();
		for (const key of typedKeys(pageData.text)) {
			const match = key.match(/^(tarif-\d+)-(?:titre|details)$/);
			if (match) {
				keys.add(match[1]);
			}
		}
		for (const key of typedKeys(pageData.pictures)) {
			if (/^tarif-\d+$/.test(key)) {
				keys.add(key);
			}
		}

		return [...keys]
			.sort(byKeyIndex)
			.map((key) => ({
				key,
				picture: pictures.find((p) => p._id === pics[key]),
				title: text[`${key}-titre`],
				lines: (text[`${key}-details`] ?? '')
					.split('\n')
					.map((line) => line.trim())
					.filter(Boolean)
					.map((line) => {
						const idx = line.indexOf(':');
						return idx >= 0
							? { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() }
							: { label: '', value: line };
					}),
			}))
			.filter((item) => item.title || item.picture || item.lines.length > 0);
	});

	function printPage() {
		window.print();
	}
</script>

<Container class="flex flex-col gap-12 py-10">
	<!-- Header / print banner -->
	<header class="flex flex-col items-center gap-3 text-center">
		<img src="/logo.svg" alt="La Bergère Enchantée" class="h-24" />
		<h1 class="font-aileron text-3xl uppercase tracking-wide text-oxford">
			Tarifs tapissier {currentYear}
		</h1>
		{#if disclaimer.title}
			<p class="text-lg font-semibold text-brunswick">{disclaimer.title}</p>
		{/if}
		{#if disclaimer.excluded.length > 0}
			<p class="text-sm text-gray-500">Hors {disclaimer.excluded.join(', ').toLowerCase()}.</p>
		{/if}
		{#if disclaimer.note}
			<p class="text-sm italic text-gray-400">{disclaimer.note}</p>
		{/if}

		<div class="no-print mt-2 flex flex-wrap justify-center gap-3">
			<a href="/catalogue.pdf" download class="btn-sunray">Télécharger le catalogue (PDF)</a>
			<button type="button" class="btn" onclick={printPage}>Imprimer cette page</button>
		</div>
	</header>

	<!-- Catalogue entries -->
	<div class="flex flex-col gap-12">
		{#each items as item, i (item.key)}
			<article
				class="catalogue-item flex flex-wrap overflow-hidden rounded-3xl text-lg text-white md:h-[30rem] md:flex-nowrap {i %
				2
					? 'bg-oxford'
					: 'bg-sunray'}"
			>
				{#if item.picture}
					<div class="h-72 w-full grow basis-auto md:h-full md:w-3/6 md:basis-0">
						<Picture
							picture={item.picture}
							fill
							sizes="(max-width: 1024px) 100vw, 512px"
							class="h-full w-full object-contain"
						/>
					</div>
				{/if}
				<div class="flex grow basis-0 flex-col items-center justify-center gap-4 px-6 py-8 text-center">
					{#if item.title}
						<h2
							class="font-aileron text-2xl font-semibold underline decoration-2 underline-offset-4"
						>
							{item.title}
						</h2>
					{/if}
					<dl class="flex flex-col gap-2">
						{#each item.lines as line}
							<div>
								{#if line.label}<dt class="inline font-semibold">{line.label} :</dt>{/if}
								<dd class="inline">{line.value}</dd>
							</div>
						{/each}
					</dl>
				</div>
			</article>
		{/each}
	</div>

	{#if items.length === 0}
		<p class="text-center text-gray-400">Le catalogue sera bientôt disponible.</p>
	{/if}

	<div class="no-print flex flex-col items-center gap-3">
		<p class="text-center text-gray-500">Un projet, une question sur un meuble&nbsp;?</p>
		<a href="/contact" class="btn-sunray">Contactez-moi</a>
	</div>
</Container>

<style>
	@media print {
		:global(header.site-header),
		:global(footer.site-footer) {
			display: none !important;
		}
		:global(body) {
			background: white;
		}
		.no-print {
			display: none !important;
		}
		.catalogue-item {
			break-inside: avoid;
		}
	}
</style>
