<script lang="ts">
	import { page } from '$app/state';
	import Picture from '$lib/components/Picture.svelte';
	import type { Page } from '$lib/types/Page';
	import { typedKeys } from '$lib/utils/typedKeys';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const cmsPages = data.pages as Page[];
	const cmsPhotos = data.photos;

	const selectedId = $derived(page.url.searchParams.get('pageId'));
	const selectedPage = $derived(cmsPages.find((p) => p._id === selectedId));

	type SaveState = 'saving' | 'saved' | 'error';
	let saveStates = $state<Record<string, SaveState>>({});

	// Local edits (keyed by page+kind+key) take precedence over the server value, so that
	// blur-saves and item swaps are reflected immediately without a full reload.
	let overrides = $state<Record<string, string>>({});

	type Field = { kind: 'text' | 'picture'; key: string };
	type Item = { key: string; number: string; fields: Field[] };
	type Section = { key: string; repeated: boolean; hasText: boolean; items: Item[] };

	function fieldId(pageId: string, kind: Field['kind'], key: string) {
		return `${pageId}:${kind}:${key}`;
	}

	function humanize(key: string) {
		const spaced = key.replace(/-/g, ' ').trim();
		return spaced.charAt(0).toUpperCase() + spaced.slice(1);
	}

	function isShort(key: string) {
		return key.endsWith('-prix') || key.endsWith('-titre') || key.startsWith('horaires-');
	}

	function pictureFor(id: string | null | undefined) {
		return cmsPhotos.find((p) => p._id === id);
	}

	function suffixOf(field: Field, itemKey: string) {
		return field.key.startsWith(itemKey) ? field.key.slice(itemKey.length).replace(/^-/, '') : '';
	}

	// The label of a field inside an item: the part after the item key (e.g. "titre", "prix"),
	// or a generic label when the field *is* the item.
	function roleLabel(field: Field, itemKey: string) {
		const rest = suffixOf(field, itemKey);
		if (rest) {
			return humanize(rest);
		}
		return field.kind === 'picture' ? 'Image' : 'Texte';
	}

	function valueOf(p: Page, kind: Field['kind'], key: string) {
		const override = overrides[fieldId(p._id, kind, key)];
		if (override !== undefined) {
			return override;
		}
		return kind === 'text' ? p.text[key] : p.pictures[key];
	}

	// Build a two-level grouping:
	//  - an "item" gathers fields sharing a base key (e.g. titre + prix, or a text + its image)
	//  - a "section" gathers items sharing a base (e.g. all "realisation-N", all "coussin-N")
	function buildSections(p: Page): Section[] {
		const fields: Field[] = [
			...typedKeys(p.text).map((key) => ({ kind: 'text' as const, key: key as string })),
			...typedKeys(p.pictures).map((key) => ({ kind: 'picture' as const, key: key as string })),
		];

		const itemsMap = new Map<string, Item>();
		for (const field of fields) {
			const itemKey = field.key.replace(/-(titre|prix)$/, '');
			let item = itemsMap.get(itemKey);
			if (!item) {
				item = { key: itemKey, number: '', fields: [] };
				itemsMap.set(itemKey, item);
			}
			item.fields.push(field);
		}

		const sectionsMap = new Map<string, Section>();
		for (const item of itemsMap.values()) {
			const sectionKey = item.key.replace(/-\d+$/, '');
			item.number = item.key.startsWith(sectionKey)
				? item.key.slice(sectionKey.length).replace(/^-/, '')
				: '';
			let section = sectionsMap.get(sectionKey);
			if (!section) {
				section = { key: sectionKey, repeated: false, hasText: false, items: [] };
				sectionsMap.set(sectionKey, section);
			}
			section.items.push(item);
		}

		const sections = [...sectionsMap.values()];
		for (const section of sections) {
			section.hasText = section.items.some((it) => it.fields.some((f) => f.kind === 'text'));
			section.repeated =
				section.items.length > 1 || section.items.some((it) => it.key !== section.key);
			// Bare item (the category image) first, then numeric order.
			section.items.sort((a, b) => {
				const na = a.number === '' ? -1 : parseInt(a.number, 10);
				const nb = b.number === '' ? -1 : parseInt(b.number, 10);
				return na - nb;
			});
		}
		return sections;
	}

	const sections = $derived(selectedPage ? buildSections(selectedPage) : []);

	// The reorderable items of a section (those carrying a numeric index).
	function numberedItems(section: Section) {
		return section.items.filter((it) => it.number !== '');
	}

	async function save(pageId: string, kind: Field['kind'], key: string, value: string) {
		const id = fieldId(pageId, kind, key);
		overrides[id] = value;
		saveStates[id] = 'saving';
		try {
			const res = await fetch('/admin/pages/' + encodeURIComponent(pageId), {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ type: kind, key, value }),
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

	// Swap every matching field (by role) between two items — i.e. move one up/down.
	function swapItems(p: Page, a: Item, b: Item) {
		const bByRole = new Map(b.fields.map((f) => [`${f.kind}:${suffixOf(f, b.key)}`, f]));
		for (const fa of a.fields) {
			const fb = bByRole.get(`${fa.kind}:${suffixOf(fa, a.key)}`);
			if (!fb) {
				continue;
			}
			const va = valueOf(p, fa.kind, fa.key) ?? '';
			const vb = valueOf(p, fb.kind, fb.key) ?? '';
			save(p._id, fa.kind, fa.key, vb);
			save(p._id, fb.kind, fb.key, va);
		}
	}

	function moveItem(p: Page, section: Section, item: Item, direction: -1 | 1) {
		const list = numberedItems(section);
		const target = list[list.indexOf(item) + direction];
		if (target) {
			swapItems(p, item, target);
		}
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

{#snippet moveControls(p: Page, section: Section, item: Item)}
	{@const list = numberedItems(section)}
	{@const idx = list.indexOf(item)}
	{#if item.number && list.length > 1}
		<div class="flex shrink-0 gap-1 sm:flex-col">
			<button
				type="button"
				class="rounded border border-gray-300 px-2 leading-none text-gray-600 transition hover:bg-gray-100 disabled:opacity-25"
				disabled={idx <= 0}
				title="Monter"
				aria-label="Monter"
				onclick={() => moveItem(p, section, item, -1)}
			>
				↑
			</button>
			<button
				type="button"
				class="rounded border border-gray-300 px-2 leading-none text-gray-600 transition hover:bg-gray-100 disabled:opacity-25"
				disabled={idx >= list.length - 1}
				title="Descendre"
				aria-label="Descendre"
				onclick={() => moveItem(p, section, item, 1)}
			>
				↓
			</button>
		</div>
	{/if}
{/snippet}

{#snippet textControl(p: Page, key: string, long: boolean)}
	{#if long}
		<textarea
			name="{p._id}_text_{key}"
			rows="3"
			class="form-input py-2"
			value={valueOf(p, 'text', key)}
			onblur={(event) => save(p._id, 'text', key, event.currentTarget.value)}
		></textarea>
	{:else}
		<input
			type="text"
			name="{p._id}_text_{key}"
			class="form-input py-1"
			value={valueOf(p, 'text', key)}
			onblur={(event) => save(p._id, 'text', key, event.currentTarget.value)}
		/>
	{/if}
{/snippet}

{#snippet pictureControl(p: Page, key: string)}
	{@const current = pictureFor(valueOf(p, 'picture', key))}
	<div class="flex h-32 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
		{#if current}
			<Picture picture={current} class="h-32 w-full object-cover" />
		{:else}
			<span class="text-sm text-gray-400">Aucune image</span>
		{/if}
	</div>
	<select
		name="{p._id}_picture_{key}"
		value={valueOf(p, 'picture', key)}
		class="form-input py-1"
		onchange={(event) => save(p._id, 'picture', key, event.currentTarget.value)}
	>
		<option value="">— Aucune —</option>
		{#each cmsPhotos as photo (photo._id)}
			<option value={photo._id}>{photo.name}</option>
		{/each}
	</select>
{/snippet}

{#snippet itemRow(p: Page, section: Section, item: Item)}
	{@const textFields = item.fields.filter((f) => f.kind === 'text')}
	{@const pictureFields = item.fields.filter((f) => f.kind === 'picture')}
	<div class="flex flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-3 sm:flex-row">
		{@render moveControls(p, section, item)}
		{#if item.number}
			<div class="shrink-0 pt-1 font-bold text-sunray sm:w-6">#{item.number}</div>
		{/if}
		{#if textFields.length > 0}
			<div class="grid flex-1 gap-3 {textFields.length > 1 ? 'sm:grid-cols-2' : ''}">
				{#each textFields as field (field.key)}
					{@const id = fieldId(p._id, 'text', field.key)}
					<label class="flex flex-col gap-1">
						<span class="form-label flex items-center gap-2 text-base">
							{roleLabel(field, item.key)}
							{@render saveBadge(id)}
						</span>
						{@render textControl(p, field.key, !isShort(field.key))}
					</label>
				{/each}
			</div>
		{/if}
		{#each pictureFields as field (field.key)}
			{@const id = fieldId(p._id, 'picture', field.key)}
			<label class="flex flex-col gap-1 sm:w-56">
				<span class="form-label flex items-center gap-2 text-base">
					{roleLabel(field, item.key)}
					{@render saveBadge(id)}
				</span>
				{@render pictureControl(p, field.key)}
			</label>
		{/each}
	</div>
{/snippet}

<div class="flex flex-col gap-6">
	<div>
		<h1 class="mb-1 text-2xl font-bold text-sunray">Pages du site</h1>
		<p class="text-gray-500">
			Choisissez une page à modifier. Les changements sont enregistrés automatiquement.
		</p>
	</div>

	<!-- Page selector -->
	<nav class="flex flex-wrap gap-2">
		{#each cmsPages as p (p._id)}
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
			<header
				class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4"
			>
				<div>
					<h2 class="text-xl font-bold text-oxford">{p.name}</h2>
					<span class="text-sm text-gray-400">{p._id}</span>
				</div>
				<a href={p._id} target="_blank" rel="noopener" class="link text-sm">Voir la page ↗</a>
			</header>

			{#each sections as section (section.key)}
				{#if !section.repeated}
					<!-- Standalone field(s) -->
					{#each section.items as item (item.key)}
						{#each item.fields as field (field.key)}
							{@const id = fieldId(p._id, field.kind, field.key)}
							<label class="flex flex-col gap-1 {field.kind === 'picture' ? 'sm:max-w-xs' : ''}">
								<span class="form-label flex items-center gap-2">
									{humanize(field.key)}
									{@render saveBadge(id)}
								</span>
								{#if field.kind === 'picture'}
									{@render pictureControl(p, field.key)}
								{:else}
									{@render textControl(p, field.key, !isShort(field.key))}
								{/if}
							</label>
						{/each}
					{/each}
				{:else if !section.hasText}
					<!-- Repeated images only: render as a gallery grid -->
					<div class="flex flex-col gap-3">
						<h3 class="text-sm font-bold uppercase tracking-wide text-gray-500">
							{humanize(section.key)}
						</h3>
						<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{#each section.items as item (item.key)}
								{#each item.fields as field (field.key)}
									{@const id = fieldId(p._id, 'picture', field.key)}
									<div class="flex flex-col gap-1 rounded-xl border border-gray-100 p-3">
										<div class="flex items-center justify-between gap-2">
											<span class="form-label flex items-center gap-2 text-base">
												{item.number ? `#${item.number}` : humanize(field.key)}
												{@render saveBadge(id)}
											</span>
											{@render moveControls(p, section, item)}
										</div>
										{@render pictureControl(p, field.key)}
									</div>
								{/each}
							{/each}
						</div>
					</div>
				{:else}
					<!-- Repeated items with text: one row per item -->
					<div class="flex flex-col gap-3">
						<h3 class="text-sm font-bold uppercase tracking-wide text-gray-500">
							{humanize(section.key)}
						</h3>
						<div class="flex flex-col gap-3">
							{#each section.items as item (item.key)}
								{@render itemRow(p, section, item)}
							{/each}
						</div>
					</div>
				{/if}
			{/each}
		</section>
	{/if}
</div>
