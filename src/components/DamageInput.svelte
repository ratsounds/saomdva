<script>
    export let index;
    export let damage = 0;
    export let crit = true;
    export let critRate = 1.5;
    export let onInput = () => {};
    export let onClickRemove = () => {};
    $: critDamage = crit ? damage : damage * critRate;
</script>

<div class="input-damage">
    <div class="index">
        <p>{index + 1}</p>
    </div>
    <div class="input">
        <input type="number" bind:value={damage} on:input={onInput} />
        <p class="crit">crit:{critDamage}</p>
    </div>
    <button class="toggle" on:click={() => (crit = !crit)} tabindex="-1">{crit ? '★' : '☆'}</button>
    <button on:click={onClickRemove} tabindex="-1">x</button>
</div>
