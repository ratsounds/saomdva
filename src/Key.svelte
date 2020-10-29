<script>
	export let key
	const items = [0]
</script>

{#each items as x (key)}
	<slot />
{/each}