<script>
    import { f3, pos } from '../lib/util.js';
    export let id = null
    export let time = 0;
    export let videoDuration = 1;
    export let height = 0;
    export let label;
    export let onClickButton = null;
    export let onClickLablel = () => {};
</script>

<div {...$$restProps} class="marker"  style="left:{pos(time, videoDuration)}%; height:{height}em">
    {#if onClickButton}<button class="setTime" on:click|stopPropagation={onClickButton} />{/if}
    <p id={id?id:null} class="moveTo" on:click|stopPropagation={onClickLablel}>{label}:{f3(time)}</p>
</div>
