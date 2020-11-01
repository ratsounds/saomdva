<script>
    import { tick } from 'svelte';

    let scale = 1;
    let x = 0;
    let y = 0;
    const delta_scale = -0.001;
    let scale_min = 1;
    let scale_max = 5;
    let video;
    function zoom(evt) {
        scale += evt.deltaY * delta_scale;
        scale = Math.min(Math.max(scale_min, scale), scale_max);
    }
    let mouse = {
        down: false,
        sx: 0,
        sy: 0,
        ex: 0,
        ey: 0,
    };
    function down(evt) {
        mouse.down = true;
        mouse.sx = evt.clientX;
        mouse.sy = evt.clientY;
    }
    function up(evt) {
        mouse.down = false;
    }
    async function move(evt) {
        if (mouse.down) {
            mouse.ex = evt.clientX;
            mouse.ey = evt.clientY;
            x = mouse.ex - mouse.sx;
            y = mouse.ey - mouse.sy;
            await tick();
        }
    }
</script>

<style>
    .video_wrapper {
        margin: 0;
        padding: 0;
        overflow: hidden;
    }
</style>

<svelte:window on:wheel|nonpassive|preventDefault={zoom} />
<!-- svelte-ignore a11y-media-has-caption -->
<div class="video_wrapper">
    <video
        {...$$restProps}
        style="transform:scale({scale}) translate({x}px, {y}px)"
        bind:this={video}
        on:mousedown={down}
        on:mouseup={up}
        on:mousemove={move}
        on:mouseleave={up} />
</div>
