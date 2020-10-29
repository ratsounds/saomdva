<script>
  import 'modern-css-reset';
  import Mov from './Mov.svelte';
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
<Mov/>
</main>