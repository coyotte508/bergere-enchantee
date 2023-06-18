<script lang="ts">
	import { enhance } from '$app/forms';
	import PictureComponent from '$lib/components/Picture.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-col items-center gap-6">
	<form method="post" action="?/update" use:enhance>
		<input type="text" name="name" class="form-input" value={data.photo.name} />
		<input type="submit" hidden />
	</form>
	<PictureComponent picture={data.photo} class="mt-2 max-w-full max-h-[500px]" />
	<form method="post" action="?/delete" use:enhance>
		<input type="submit" value="Supprimer" class="mt-2 btn-red" />
	</form>
</div>
