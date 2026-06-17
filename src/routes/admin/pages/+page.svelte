<script lang="ts">
	import { page } from '$app/state';
	import Picture from '$lib/components/Picture.svelte';
	import type { Page } from '$lib/types/Page';
	import type { Picture as PictureDoc } from '$lib/types/Picture';
	import { typedKeys } from '$lib/utils/typedKeys';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const cmsPages = data.pages as Page[];
	let cmsPhotos = $state<PictureDoc[]>(data.photos);

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
			const itemKey = field.key.replace(/-(titre|prix|details)$/, '');
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

	const baseSections = $derived(selectedPage ? buildSections(selectedPage) : []);

	// Locally-revealed extra rows (so "+ add" works even past the prepared range).
	let drafts = $state<Record<string, true>>({});

	function draftId(pageId: string, itemKey: string) {
		return `${pageId}::${itemKey}`;
	}

	function itemFilled(p: Page, item: Item) {
		return item.fields.some((f) => {
			const value = valueOf(p, f.kind, f.key);
			return value !== undefined && value !== null && value !== '';
		});
	}

	// Build a fresh item (not present in the data yet) from a section's template item.
	function makeItem(sectionKey: string, num: string, template: Item): Item {
		return {
			key: `${sectionKey}-${num}`,
			number: num,
			fields: template.fields.map((f) => {
				const suffix = suffixOf(f, template.key);
				return {
					kind: f.kind,
					key: suffix ? `${sectionKey}-${num}-${suffix}` : `${sectionKey}-${num}`,
				};
			}),
		};
	}

	// Only show items that have content (or were just added), plus any draft rows.
	const sections = $derived.by((): Section[] => {
		const p = selectedPage;
		if (!p) {
			return [];
		}
		return baseSections.map((section) => {
			if (!section.repeated) {
				return section;
			}
			const bare = section.items.filter((it) => it.number === '');
			const dataNumbered = section.items.filter((it) => it.number !== '');
			const template = dataNumbered[0] ?? section.items[0];

			const shown = dataNumbered.filter(
				(it) => itemFilled(p, it) || drafts[draftId(p._id, it.key)]
			);
			const shownNumbers = new Set(shown.map((it) => parseInt(it.number, 10)));

			const extras: Item[] = [];
			const prefix = `${p._id}::`;
			for (const id of Object.keys(drafts)) {
				if (!id.startsWith(prefix)) {
					continue;
				}
				const itemKey = id.slice(prefix.length);
				if (itemKey.replace(/-\d+$/, '') !== section.key) {
					continue;
				}
				const num = itemKey.slice(section.key.length).replace(/^-/, '');
				if (!num || shownNumbers.has(parseInt(num, 10))) {
					continue;
				}
				extras.push(makeItem(section.key, num, template));
			}

			const numbered = [...shown, ...extras].sort(
				(a, b) => parseInt(a.number, 10) - parseInt(b.number, 10)
			);
			return { ...section, items: [...bare, ...numbered] };
		});
	});

	// The reorderable items of a section (those carrying a numeric index).
	function numberedItems(section: Section) {
		return section.items.filter((it) => it.number !== '');
	}

	// Reveal the lowest free index in a section as a new editable row.
	function addItem(p: Page, section: Section) {
		const used = new Set(numberedItems(section).map((it) => parseInt(it.number, 10)));
		let num = 1;
		while (used.has(num)) {
			num++;
		}
		drafts[draftId(p._id, `${section.key}-${num}`)] = true;
	}

	// Clear an item's content (so it disappears) and drop any draft entry.
	function removeItem(p: Page, item: Item) {
		if (!confirm('Supprimer cet élément ? Son contenu sera effacé.')) {
			return;
		}
		for (const f of item.fields) {
			const value = valueOf(p, f.kind, f.key);
			if (value !== undefined && value !== null && value !== '') {
				save(p._id, f.kind, f.key, '');
			}
		}
		delete drafts[draftId(p._id, item.key)];
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

	// ---- Image picker / upload ----------------------------------------------
	let picker = $state<{ pageId: string; key: string } | null>(null);
	let pickerSearch = $state('');
	let uploading = $state<Record<string, boolean>>({});

	const filteredPhotos = $derived.by(() => {
		const term = pickerSearch.trim().toLowerCase();
		return term ? cmsPhotos.filter((p) => p.name.toLowerCase().includes(term)) : cmsPhotos;
	});

	function openPicker(p: Page, key: string) {
		picker = { pageId: p._id, key };
		pickerSearch = '';
	}

	function choosePicture(photoId: string) {
		if (picker) {
			save(picker.pageId, 'picture', picker.key, photoId);
		}
		picker = null;
	}

	function onFileChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			importPicture(file);
		}
		input.value = '';
	}

	// Presign → upload to S3 → generate the Picture → select it.
	async function importPicture(file: File) {
		if (!picker) {
			return;
		}
		const id = fieldId(picker.pageId, 'picture', picker.key);
		uploading[id] = true;
		try {
			const presign = await fetch('/admin/fichiers', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ name: file.name, mimeType: file.type, size: file.size }),
			});
			if (!presign.ok) {
				throw new Error(await presign.text());
			}
			const { _id, url } = await presign.json();

			const put = await fetch(url, { method: 'PUT', body: file });
			if (!put.ok) {
				throw new Error(await put.text());
			}

			const generated = await fetch('/admin/pages/photo', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ photoId: _id }),
			});
			if (!generated.ok) {
				throw new Error(await generated.text());
			}
			const picture: PictureDoc = await generated.json();

			cmsPhotos = [picture, ...cmsPhotos];
			choosePicture(picture._id);
		} catch (err) {
			alert("Erreur lors de l'import : " + (err instanceof Error ? err.message : String(err)));
		} finally {
			uploading[id] = false;
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

{#snippet removeButton(p: Page, item: Item)}
	{#if item.number}
		<button
			type="button"
			class="self-start rounded border border-red-200 px-2 leading-none text-red-500 transition hover:bg-red-50"
			title="Supprimer"
			aria-label="Supprimer"
			onclick={() => removeItem(p, item)}
		>
			✕
		</button>
	{/if}
{/snippet}

{#snippet addButton(p: Page, section: Section)}
	<button
		type="button"
		class="self-start rounded-lg border-2 border-dashed border-gray-300 px-4 py-2 text-sm font-semibold text-gray-500 transition hover:border-sunray hover:text-sunray"
		onclick={() => addItem(p, section)}
	>
		+ Ajouter
	</button>
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
	<button
		type="button"
		class="group relative flex h-32 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
		title="Choisir une image"
		onclick={() => openPicker(p, key)}
	>
		{#if current}
			<Picture picture={current} class="h-32 w-full object-cover" />
		{:else}
			<span class="text-sm text-gray-400">Choisir une image…</span>
		{/if}
		<span
			class="absolute inset-0 hidden items-center justify-center bg-black/40 text-sm font-semibold text-white group-hover:flex"
		>
			Changer
		</span>
	</button>
	<div class="flex gap-3 text-sm">
		<button type="button" class="link" onclick={() => openPicker(p, key)}>Choisir / importer</button>
		{#if current}
			<button
				type="button"
				class="text-red-500 hover:underline"
				onclick={() => save(p._id, 'picture', key, '')}
			>
				Retirer
			</button>
		{/if}
	</div>
{/snippet}

{#snippet itemRow(p: Page, section: Section, item: Item)}
	{@const textFields = item.fields.filter((f) => f.kind === 'text')}
	{@const pictureFields = item.fields.filter((f) => f.kind === 'picture')}
	{@const allShort = textFields.every((f) => isShort(f.key))}
	<div class="flex flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-3 sm:flex-row">
		{@render moveControls(p, section, item)}
		{#if item.number}
			<div class="shrink-0 pt-1 font-bold text-sunray sm:w-6">#{item.number}</div>
		{/if}
		{#if textFields.length > 0}
			<div class="grid flex-1 gap-3 {textFields.length > 1 && allShort ? 'sm:grid-cols-2' : ''}">
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
		{@render removeButton(p, item)}
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
											<div class="flex items-center gap-1">
												{@render moveControls(p, section, item)}
												{@render removeButton(p, item)}
											</div>
										</div>
										{@render pictureControl(p, field.key)}
									</div>
								{/each}
							{/each}
						</div>
						{@render addButton(p, section)}
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
						{@render addButton(p, section)}
					</div>
				{/if}
			{/each}
		</section>
	{/if}
</div>

{#if picker}
	{@const uploadingId = fieldId(picker.pageId, 'picture', picker.key)}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<button class="absolute inset-0 bg-black/50" aria-label="Fermer" onclick={() => (picker = null)}
		></button>
		<div
			class="relative flex max-h-[85vh] w-full max-w-3xl flex-col gap-4 overflow-hidden rounded-2xl bg-white p-5 shadow-xl"
		>
			<div class="flex items-center gap-3">
				<h3 class="shrink-0 text-lg font-bold text-oxford">Choisir une image</h3>
				<input
					type="text"
					placeholder="Rechercher…"
					class="form-input py-1"
					bind:value={pickerSearch}
				/>
				<button
					type="button"
					class="ml-auto text-3xl leading-none text-gray-400 hover:text-gray-600"
					aria-label="Fermer"
					onclick={() => (picker = null)}
				>
					×
				</button>
			</div>

			<label
				class="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-semibold text-gray-500 transition hover:border-sunray hover:text-sunray"
			>
				{#if uploading[uploadingId]}
					Import en cours…
				{:else}
					+ Importer une nouvelle image
				{/if}
				<input
					type="file"
					accept="image/*"
					class="hidden"
					disabled={uploading[uploadingId]}
					onchange={onFileChange}
				/>
			</label>

			<div class="grid grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 md:grid-cols-4">
				<button
					type="button"
					class="flex h-24 items-center justify-center rounded-lg border border-gray-200 text-sm text-gray-400 transition hover:border-sunray"
					onclick={() => choosePicture('')}
				>
					Aucune
				</button>
				{#each filteredPhotos as photo (photo._id)}
					<button
						type="button"
						class="flex flex-col overflow-hidden rounded-lg border border-gray-200 transition hover:border-sunray"
						onclick={() => choosePicture(photo._id)}
					>
						<Picture picture={photo} class="h-24 w-full object-cover" />
						<span class="truncate p-1 text-xs text-gray-600">{photo.name}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>
{/if}
