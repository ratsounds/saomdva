<script>
    import SvelteSeo from 'svelte-seo';
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

<SvelteSeo
    openGraph={{ title: 'SAO:MD:VA', description: 'This web app is a tool for SAO:MD(Sword Art Online - Memory Defrag) skill durations video analysis.', url: 'https://ratsounds.github.io/saomdva/', type: 'website', images: [{ url: 'https://ratsounds.github.io/saomdva/pgp.png', width: 1280, height: 640, alt: 'SAO:MD:VA' }] }} />
<main>
    <VA />
</main>
