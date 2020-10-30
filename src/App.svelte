<script>
    import 'modern-css-reset';
    import VA from './VA.svelte';
</script>

<style>
    main {
        width: 100%;
        height: 100vh;
        overflow: hidden;
        display: grid;
        grid-template-rows: auto 1fr auto;
        grid-template-columns: 1fr;
        align-items: center;
        justify-content: center;
    }
</style>

<svelte:head>
    <meta name="title" content="SAO:MD:VA" />
    <meta name="description"
        content="This web app is a tool for SAO:MD(Sword Art Online - Memory Defrag) skill durations video analysis." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://ratsounds.github.io/saomdva/" />
    <meta property="og:title" content="SAO:MD:VA" />
    <meta property="og:description"
        content="This web app is a tool for SAO:MD(Sword Art Online - Memory Defrag) skill durations video analysis." />
    <meta property="og:image" content="https://ratsounds.github.io/saomdva/pgp.png" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://ratsounds.github.io/saomdva/" />
    <meta property="twitter:site" content="@ratsounds" />    
</svelte:head>
<main>
    <VA />
</main>
