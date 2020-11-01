<script>
    export let current = 0;
    export let videoDuration = 1;
    const frameLength = 1 / 60;
    let bar;

    function getPos(time) {
        return (100 * time) / videoDuration;
    }
    function clickBar(evt) {
        current = (evt.offsetX / bar.offsetWidth) * videoDuration;
    }
    function prev() {
        current = Math.max(0, current - frameLength);
    }
    function next() {
        current = Math.min(videoDuration, current + frameLength);
    }
</script>

<div {...$$restProps}>
    <button on:click={prev}>prev</button>
    <div id="bar" on:click|self={clickBar} bind:this={bar}>
        <div class="current" style="width:{getPos(current)}%" />
        <slot />
    </div>
    <button on:click={next}>next</button>
</div>
