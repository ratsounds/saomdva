<script>
    import 'modern-css-reset';
    import './global.css';
    import VADuration from './pages/VADuration.svelte';
    import VADamage from './pages/VADamage.svelte';
    const types = ['duration', 'damage'];
    let type = 'duration';
    function switchType() {
        const index = types.findIndex((item) => item === type) + 1;
        type = index < types.length ? types[index] : types[0];
    }
    let files;
    let url;
    let openFile;
    function open(ev) {
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onload = function (evt) {
                url = window.URL.createObjectURL(new Blob([new Uint8Array(reader.result)]));
            };
            reader.readAsArrayBuffer(files[0]);
        }
    }
</script>

<header>
    <h1 id="logo" class="action">SAO:MD:VA</h1>
    <nav>
        <button id="type" on:click={switchType}>{type}</button>
        <input type="file" bind:files accept="video/*" on:change={open} bind:this={openFile} />
        <p class="fname">
            {#if files && files[0]}{files[0].name}{/if}
        </p>
        <button id="open" on:click={openFile.click()}>open</button>
    </nav>
</header>

<main id={type}>
    {#if type === 'duration'}
        <VADuration {url} />
    {:else}
        <VADamage {url} />
    {/if}
</main>
