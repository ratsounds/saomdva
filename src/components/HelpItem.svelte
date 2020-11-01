<script>
    export let item = {};
    export let lang = 'en';
    export let onClickHeader = () => {};
</script>

{#if item}
    <div class="step {item.active ? 'active' : ''}">
        <h2 on:click={onClickHeader}>{item.title}</h2>
        {#each item[lang] as html}
            <p>
                {@html html}
            </p>
        {/each}
    </div>
{/if}
