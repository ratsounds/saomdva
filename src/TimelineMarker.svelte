<script>
    import { onMount } from 'svelte';
    export let min;
    export let max;
    $: dif = max - min;
    export let current;
    let currentMarker = {};
    export let markers;
    let bar;
    onMount(() => {
        resize();
    });
    function resize() {
        if ((bar, currentMarker.elem)) {
            const b = bar.getBoundingClientRect();
            const c = currentMarker.elem.getBoundingClientRect();
            currentMarker.height = b.bottom - c.bottom;
            for (let marker of markers) {
                const m = marker.elem.getBoundingClientRect();
                marker.marginTop = b.top - m.top;
                marker.height = m.bottom - b.top;
            }
        }
    }
    function getPos(time) {
        return dif ? (100 * (time - min)) / dif : 0;
    }
    function clickBar(evt) {
        current = (evt.offsetX / bar.offsetWidth) * dif + min;
    }
    function moveTo(marker) {
        current = marker.time;
    }

    function setTime(marker) {
        marker.time = current;
    }
</script>

<style>
    .timeline {
        margin: 0 1em;
        width: 100%;
        height: 100%;
        flex: 1;
    }
    .bar {
        position: relative;
        width: 100%;
        height: 1em;
        background-color: #000;
        color: #fff;
    }

    .bar > * {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        pointer-events: none;
    }
    .current {
        background-color: #fff6;
    }
    .cmarker {
        margin-bottom: 1em;
    }
    .marker {
        position: relative;
        padding: 0 1em;
        border-bottom: 1px solid #000;
        font-size: 50%;
        width: 10em;
        user-select: none;
        white-space: nowrap;
    }
    .line {
        position: absolute;
        top: 0;
        left: 0;
        width: 0.1em;
        height: 7em;
        background-color: #000;
        pointer-events: none;
    }
    .cmarker .line {
        top: 100%;
    }

    button {
        appearance: none;
        outline: none;
        border: none;
        border-radius: 1em;
        background-color: #f00;
        width: 1em;
        height: 1em;
    }
</style>

<div class="timeline" on:resize={resize()}>
    <div class="cmarker marker" style="left:{getPos(current)}%" bind:this={currentMarker.elem}>
        current:{current}
        <div class="line" style="height:{currentMarker.height}px" />
    </div>
    <div class="bar" on:click={clickBar} bind:this={bar}>
        <div class="current" style="width:{getPos(current)}%" />
    </div>
    {#each markers as marker}
        <div class="marker" style="left:{getPos(marker.time)}%" bind:this={marker.elem} on:click={moveTo(marker)}>
            <button on:click|stopPropagation={setTime(marker)} />
            {marker.label}:{marker.time}
            <div class="line" style="margin-top:{marker.marginTop}px;height:{marker.height}px" />
        </div>
    {/each}
    
</div>
