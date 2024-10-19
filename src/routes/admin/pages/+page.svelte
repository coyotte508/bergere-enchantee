<script lang="ts">
	import { page } from '$app/stores';
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

<ul class="list-disc">
	{#each data.pages as page}
		<li>
			<a href="/admin/pages?pageId={page._id}"><span class="link">{page._id}</span> - {page.name}</a
			>
		</li>
	{/each}
</ul>
{#each data.pages.filter((p) => p._id === $page.url.searchParams.get('pageId')) as page}
	<section class="flex flex-col gap-4">
		<h1 class="text-sunray">{page.name} ({page._id})</h1>

		<h2>Textes</h2>

		{#each typedKeys(page.text).filter((k) => !k.endsWith('-prix') && !k.endsWith('-titre')) as key}
			<label class="form-label">
				{key}
				<textarea
					name="{page._id}_text_{key}"
					cols="30"
					rows="3"
					class="form-input"
					value={page.text[key]}
					on:blur={(event) => updateText(page, key, event.currentTarget.value)}
				/>
			</label>
		{/each}

		<div class="grid grid-cols-2 gap-4">
			{#each typedKeys(page.text).filter((k) => k.endsWith('-prix') || k.endsWith('-titre')) as key}
				<label class="form-label">
					{key}
					<input
						type="text"
						name="{page._id}_text_{key}"
						class="form-input"
						value={page.text[key]}
						on:blur={(event) => updateText(page, key, event.currentTarget.value)}
					/>
				</label>
			{/each}
		</div>

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
