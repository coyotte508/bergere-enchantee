<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="border border-red-500 bg-red-300 rounded-lg p-2">
	{$page.error?.message}
</div>
