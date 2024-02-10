<script lang="ts">
	import type { Page } from '$lib/types/Page';
	import { typedKeys } from '$lib/utils/typedKeys';
	import type { PageData } from './$types';

	export let data: PageData;

	function updatePicture(page: Page, key: string, value: string) {
		fetch('/admin/pages/' + encodeURIComponent(page._id), {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ type: 'picture', key, value }),
		});
	}

	function updateText(page: Page, key: string, value: string) {
		fetch('/admin/pages/' + encodeURIComponent(page._id), {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ type: 'text', key, value }),
		});
	}
</script>

{#each data.pages as page}
	<section class="flex flex-col gap-4">
		<h1 class="text-sunray">{page.name} ({page._id})</h1>

		<h2>Textes</h2>

		{#each typedKeys(page.text) as key}
			<label class="form-label">
				{key}
				<textarea
					name="{page._id}_text_{key}"
					cols="30"
					rows="10"
					class="form-input"
					value={page.text[key]}
					on:blur={(event) => updateText(page, key, event.currentTarget.value)}
				/>
			</label>
		{/each}

		<h2>Images</h2>

		{#each typedKeys(page.pictures) as key}
			<label class="form-label">
				{key}
				<select
					name="{page._id}_picture_{key}"
					value={page.pictures[key]}
					class="form-input"
					on:change={(event) => updatePicture(page, key, event.currentTarget.value)}
				>
					{#each data.photos as photo}
						<option value={photo._id}>{photo.name}</option>
					{/each}
				</select>
			</label>
		{/each}
	</section>
{/each}
