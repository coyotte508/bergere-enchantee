<script lang="ts">
	export let noPadding = false;
	let className = '';
	export { className as class };

	$: classes = noPadding ? className : className + ' pa-3 ';
</script>

<div class="max-w-6xl w-full mx-auto overflow-hidden box-border {classes}" {...$$restProps}>
	<slot />
</div>
