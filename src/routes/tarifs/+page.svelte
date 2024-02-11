<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import type { PricingPage } from '$lib/types/Page.js';

	export let data;

	const pictures = data.pictures;
	const pageData = data.pageData as PricingPage;

	const array = Array(12)
		.fill(0)
		.map((_, i) => i + 1);
</script>

<section>
	<Container class="text-center flex flex-col">
		<h2>Changement de tissu uniquement</h2>
		<div class="grid gap-4 w-full" style="grid-template-columns: repeat(auto, auto, auto);">
			{#each array as i}
				{#if pageData.text[`remplacement-tissu-${i}-titre`] && pageData.text[`remplacement-tissu-${i}-prix`]}
					<div>
						<h3>{pageData.text[`remplacement-tissu-${i}-titre`]}</h3>
						<p>{pageData.text[`remplacement-tissu-${i}-prix`]}</p>
					</div>
				{/if}
			{/each}
		</div>
	</Container>
</section>
