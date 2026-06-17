<script lang="ts">
	import { page } from '$app/state';
	import Picture from '$lib/components/Picture.svelte';
	import type { Page } from '$lib/types/Page';
	import { typedKeys } from '$lib/utils/typedKeys';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const selectedId = $derived(page.url.searchParams.get('pageId'));
	const selectedPage = $derived(data.pages.find((p) => p._id === selectedId));

	type SaveState = 'saving' | 'saved' | 'error';
	let saveStates = $state<Record<string, SaveState>>({});

	function fieldId(pageId: string, type: string, key: string) {
		return `${pageId}:${type}:${key}`;
	}

	function humanize(key: string) {
		const spaced = key.replace(/-/g, ' ').trim();
		return spaced.charAt(0).toUpperCase() + spaced.slice(1);
	}

	function pictureFor(id: string | null | undefined) {
		return data.photos.find((p) => p._id === id);
	}

	async function save(pageId: string, type: 'text' | 'picture', key: string, value: string) {
		const id = fieldId(pageId, type, key);
		saveStates[id] = 'saving';
		try {
			const res = await fetch('/admin/pages/' + encodeURIComponent(pageId), {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ type, key, value }),
			});
			if (!res.ok) {
				throw new Error('save failed');
			}
			saveStates[id] = 'saved';
			setTimeout(() => {
				if (saveStates[id] === 'saved') {
					delete saveStates[id];
				}
			}, 2000);
		} catch {
			saveStates[id] = 'error';
		}
	}

	function isShort(key: string) {
		return key.endsWith('-prix') || key.endsWith('-titre') || key.startsWith('horaires-');
	}

	function longTextKeys(p: Page) {
		return typedKeys(p.text).filter((k) => !isShort(k as string));
	}
	function shortTextKeys(p: Page) {
		return typedKeys(p.text).filter((k) => isShort(k as string));
	}
</script>

{#snippet saveBadge(id: string)}
	{#if saveStates[id] === 'saving'}
		<span class="text-sm font-normal text-gray-400">Enregistrement…</span>
	{:else if saveStates[id] === 'saved'}
		<span class="text-sm font-normal text-green-600">✓ Enregistré</span>
	{:else if saveStates[id] === 'error'}
		<span class="text-sm font-normal text-red-600">⚠ Erreur</span>
	{/if}
{/snippet}

<div class="flex flex-col gap-6">
	<div>
		<h1 class="text-sunray text-2xl font-bold mb-1">Pages du site</h1>
		<p class="text-gray-500">Choisissez une page à modifier. Les changements sont enregistrés
			automatiquement.</p>
	</div>

	<!-- Page selector -->
	<nav class="flex flex-wrap gap-2">
		{#each data.pages as p (p._id)}
			{@const active = p._id === selectedId}
			<a
				href="?pageId={encodeURIComponent(p._id)}"
				class="flex flex-col rounded-xl border-2 px-4 py-2 transition hover:border-sunray"
				class:border-sunray={active}
				class:bg-sunray={active}
				class:text-white={active}
				class:border-gray-200={!active}
				class:bg-white={!active}
			>
				<span class="font-semibold">{p.name}</span>
				<span class="text-xs opacity-70">{p._id}</span>
			</a>
		{/each}
	</nav>

	{#if !selectedPage}
		<div class="rounded-xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400">
			Sélectionnez une page ci-dessus pour commencer.
		</div>
	{:else}
		{@const p = selectedPage}
		<section class="flex flex-col gap-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			<header class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
				<div>
					<h2 class="text-oxford text-xl font-bold">{p.name}</h2>
					<span class="text-sm text-gray-400">{p._id}</span>
				</div>
				<a href={p._id} target="_blank" rel="noopener" class="link text-sm">Voir la page ↗</a>
			</header>

			<!-- Long text -->
			{#if longTextKeys(p).length > 0}
				<div class="flex flex-col gap-4">
					<h3 class="text-oxford font-bold uppercase tracking-wide text-sm text-gray-500">Textes</h3>
					{#each longTextKeys(p) as key (key)}
						{@const id = fieldId(p._id, 'text', key as string)}
						<label class="flex flex-col gap-1">
							<span class="form-label flex items-center gap-2">
								{humanize(key as string)}
								{@render saveBadge(id)}
							</span>
							<textarea
								name="{p._id}_text_{key}"
								rows="3"
								class="form-input py-2"
								value={p.text[key as keyof typeof p.text]}
								onblur={(event) => save(p._id, 'text', key as string, event.currentTarget.value)}
							></textarea>
						</label>
					{/each}
				</div>
			{/if}

			<!-- Short text (titres / prix / horaires) -->
			{#if shortTextKeys(p).length > 0}
				<div class="flex flex-col gap-4">
					<h3 class="text-oxford font-bold uppercase tracking-wide text-sm text-gray-500">
						Titres &amp; prix
					</h3>
					<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each shortTextKeys(p) as key (key)}
							{@const id = fieldId(p._id, 'text', key as string)}
							<label class="flex flex-col gap-1">
								<span class="form-label text-base flex items-center gap-2">
									{humanize(key as string)}
									{@render saveBadge(id)}
								</span>
								<input
									type="text"
									name="{p._id}_text_{key}"
									class="form-input py-1"
									value={p.text[key as keyof typeof p.text]}
									onblur={(event) => save(p._id, 'text', key as string, event.currentTarget.value)}
								/>
							</label>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Images -->
			{#if typedKeys(p.pictures).length > 0}
				<div class="flex flex-col gap-4">
					<h3 class="text-oxford font-bold uppercase tracking-wide text-sm text-gray-500">Images</h3>
					<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each typedKeys(p.pictures) as key (key)}
							{@const id = fieldId(p._id, 'picture', key as string)}
							{@const current = pictureFor(p.pictures[key as keyof typeof p.pictures])}
							<div class="flex flex-col gap-2 rounded-xl border border-gray-100 p-3">
								<span class="form-label text-base flex items-center gap-2">
									{humanize(key as string)}
									{@render saveBadge(id)}
								</span>
								<div
									class="flex h-32 items-center justify-center overflow-hidden rounded-lg bg-gray-100"
								>
									{#if current}
										<Picture picture={current} class="h-32 w-full object-cover" />
									{:else}
										<span class="text-sm text-gray-400">Aucune image</span>
									{/if}
								</div>
								<select
									name="{p._id}_picture_{key}"
									value={p.pictures[key as keyof typeof p.pictures]}
									class="form-input py-1"
									onchange={(event) => save(p._id, 'picture', key as string, event.currentTarget.value)}
								>
									{#each data.photos as photo (photo._id)}
										<option value={photo._id}>{photo.name}</option>
									{/each}
								</select>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</section>
	{/if}
</div>
