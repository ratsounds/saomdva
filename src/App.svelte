<script>
  import 'modern-css-reset';
  import VA from './VA.svelte';
</script>
<style>
  main {
    width: 100%;
    height:100vh;
    overflow: hidden;
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 1fr;
    align-items: center;
    justify-content: center;
  }

</style>
<main>
<VA/>
</main>