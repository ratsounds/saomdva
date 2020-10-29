<script>
    let files;
    let url;
    let current = 0;
    let duration = 1;
    const frameLength = 1 / 60;

    let bar;
    let markers = [
        { label: '1st-on', time: 0 }, //0
        { label: '1acc-on', time: 0 }, //1
        { label: '1acc-off', time: 0 }, //2
        { label: '2nd-on', time: 0 }, //3
        { label: '2acc-on', time: 0 }, //4
        { label: '2acc-off', time: 0 }, //5
        { label: 'comb-on', time: 0 }, //6
    ];
    function getPos(time) {
        return (100 * time) / duration;
    }

    $: s3r_blackout = markers[1].time - markers[0].time;
    $: s3r_accel = markers[2].time - markers[1].time;
    $: s3r_duration = markers[3].time - markers[1].time;
    $: s3r_comb = markers[6].time - markers[4].time;
    $: s3r_gap = s3r_duration - s3r_comb;

    $: s3r_blackout2 = markers[4].time - markers[3].time;
    $: s3r_accel2 = markers[5].time - markers[4].time;

    let s3g_blackout = 0;
    $: s3g_accel = s3r_accel / 3;
    $: s3g_duration = s3g_accel + s3r_duration - s3r_accel;
    $: s3g_comb = s3r_comb <= s3r_accel ? s3r_comb / 3 : s3g_accel + s3r_comb - s3r_accel;
    $: s3g_gap = s3r_comb <= s3r_accel ? s3g_accel - s3r_comb + s3r_duration - s3r_accel : s3r_gap;

    let openFile;
    function open(ev) {
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onload = function (evt) {
                url = window.URL.createObjectURL(new Blob([new Uint8Array(reader.result)]));
                current = 0;
            };
            reader.readAsArrayBuffer(files[0]);
        }
    }

    function clickBar(evt) {
        current = (evt.offsetX / bar.offsetWidth) * duration;
    }
    function prev() {
        current = Math.max(0, current - frameLength);
    }
    function next() {
        current = Math.min(duration, current + frameLength);
    }
    function moveTo(time) {
        current = time;
    }
    function setTime(i) {
        markers[i].time = current;
    }

    let steps = [
        {
            title: 'overview',
            html: ['this web app is a tool for sao:md skill durations video analysis.'],
            active: true,
            action: 'logo',
        },
        {
            title: 'take a video',
            html: [
                "take a video that consists of analysis unit's solo ss3 and combination from analysis target unit into support unit.all ss3 input should be bufferd without delay.",
            ],
            action: 'logo',
        },
        { title: 'open video', html: ["open ss3 video from 'open' at right upper."], action: 'open' },
        {
            title: 'seek video',
            html: ['click bottom seek bar for roughly seeking.', 'click prev or next button for 1/60 frame seeking'],
            action: 'bar',
        },
        {
            title: 'set marker pos',
            html: ['indicator with circle and label at the bottom of seek bar is marker to control specific time frames for ss3 durations calculation in video timeline.', 'click left circle: set marker position to current position', 'click right label:  set current position to marker positon'],
            action: '1st-on',
        },
        {
            title: 'find 1st-on',
            html: [
                '1st-on is a frame that ss3 is activated.',
                'this frame can be found by mp change. at the same frame, blackout effect is activated on 6* units.',
            ],
            action: '1st-on',
        },
        {
            title: 'find 1acc-on',
            html: [
                '1acc-on is a frame that acceleration is activated.',
                'this frame can be found by fade in of acceleration effect on right high contrasted video or fade out of blackout effect on center high saturated video.',
                'note that the timing of acceleration effect fade in get 1-3 frame delay by hardware, os and processing load.',
            ],
            action: '1acc-on',
        },
        {
            title: 'find 1acc-off',
            html: [
                '1acc-off is a frame that acceleration is deactivated.',
                'this frame can be found by fade out of acceleration effect on right high contrasted video.',
            ],
            action: '1acc-off',
        },
        {
            title: 'find 2nd-on',
            html: ['2nd-on is a frame that 2nd ss3 is activated.', "it is same as 'find 1st-on'"],
            action: '2nd-on',
        },
        {
            title: 'find 2acc-on',
            html: ["2acc-on is a frame that 2nd ss3's acceleration is activated.", "it is same as 'find 2acc-on'"],
            action: '2acc-on',
        },
        {
            title: 'find 2acc-off',
            html: ["2acc-off is a frame that 2nd ss3' acceleration is deactivated.", "it is same as 'find 2acc-off'"],
            action: '2acc-off',
        },
        {
            title: 'find comb-on',
            html: [
                "comb-on is a frame that combination partner's ss3 is activated.",
                'this frame can be found by same as 1st-on and 2nd-on. anoter way is name change at left top hp/mp indicator.',
            ],
            action: 'comb-on',
        },
    ];
    function activate(index) {
        for (let step of steps) {
            step.active = false;
        }
        steps[index].active = true;
        Array.from(document.getElementsByClassName('action')).forEach((elem) => {
            elem.classList.remove('action');
        });
        const action = steps[index].action;
        console.log(action);
        if (action) {
            document.getElementById(action).classList.add('action');
        }
    }
</script>

<style>
    h1 {
        flex: 1;
        font-size: 1em;
    }
    .videos {
        padding: 0 0.5em;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        width: 100%;
        height: 100%;
    }
    video {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    .help {
        padding: 1em;
        background-color: #444;
        color: #fff;
    }
    .help h2 {
        font-size: 1em;
        cursor: pointer;
    }
    .help .active h2 {
        font-size: 1.5em;
    }
    .help p {
        font-size: 0.75em;
        padding: 0 0 0.5em 1em;
        display: none;
    }
    .help .active p {
        display: block;
    }
    .action {
        background-image: repeating-linear-gradient(
            0deg,
            rgba(255, 204, 0, 1),
            rgba(255, 204, 0, 1) 0.5em,
            transparent 0.5em,
            transparent
        );
        background-size: 100%;
    }

    .fblackout {
        filter: brightness(4) saturate(10) contrast(5);
    }
    .faccele {
        filter: brightness(5) contrast(1.5);
    }
    .control {
        display: flex;
        padding: 0.5em;
        align-items: center;
        justify-content: center;
    }
    input[type='file'] {
        display: none;
    }
    .fname {
        padding: 0 1em;
    }
    button {
        appearance: none;
        outline: none;
        border: 0.1em solid #444;
        margin: 0;
        padding: 0 1em;
        background-color: #444;
        color: #fff;
        border-radius: 0;
        cursor: pointer;
    }
    button:hover {
        background-color: #fff;
        color: #444;
    }
    .timeline {
        font-size: 50%;
    }
    .timeline > * {
        height: 2em;
        margin: 0 0 16em 0;
    }
    .timeline > button {
        width: 5em;
    }
    .bar {
        position: relative;
        width: 100%;
        background-color: #444;
        color: #fff;
        cursor: pointer;
    }

    .bar > * {
        position: absolute;
        height: 2em;
    }
    .current {
        background-color: #fff6;
        pointer-events: none;
    }

    .marker {
        position: absolute;
        top: 0;
        left: 0;
        color: #444;
        border-left: 0.1em solid #444;
        border-bottom: 0.1em solid #444;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        pointer-events: none;
    }
    .marker > p {
        pointer-events: fill;
        cursor: pointer;
    }
    .setTime {
        border: none;
        border-radius: 2em;
        margin: 0.2em;
        padding: 0;
        width: 1.5em;
        height: 1.5em;
        background-color: #ccc;
        pointer-events: fill;
        cursor: pointer;
    }
    .setTime:hover {
        background-color: #f44;
    }
    .info {
        font-size: 0.5em;
        position: relative;
        padding: 0.25em;
        overflow: hidden;
    }
    .info * {
        text-indent: 0.5em;
    }
    .realtime {
        color: #444;
        padding: 0 5em;
    }
    .blackout {
        background-color: #444;
        color: #fff;
        margin: 0 1px;
    }
    .duration {
        background-color: #fc0;
        color: #fff;
        padding: 1px;
    }
    .info .wrapper {
        display: flex;
    }
    .acceleration {
        background-color: #f44;
        color: #fff;
        border: 1px solid #fff;
    }
    .combination {
        background-color: #48f;
        color: #fff;
        border: 1px solid #fff;
        margin-top: -1px;
    }
    .gap {
        background-color: #fff;
        color: #444;
    }
</style>

<div class="control">
    <h1 id="logo" class="action">SAO:MD:VA</h1>
    <input type="file" bind:files accept="video/*" on:change={open} bind:this={openFile} />
    <p class="fname">
        {#if files && files[0]}{files[0].name}{/if}
    </p>
    <button id="open" on:click={openFile.click()}>open</button>
</div>
<div class="videos">
    <div class="help">
        {#each steps as step, i}
            <div class="step {step.active ? 'active' : ''}">
                <h2 on:click={() => activate(i)}>{i ? i + '.' : ''} {step.title}</h2>
                {#each step.html as html}
                    <p>
                        {@html html}
                    </p>
                {/each}
            </div>
        {/each}
    </div>
    <!-- svelte-ignore a11y-media-has-caption -->
    <video src={url} bind:currentTime={current} bind:duration />
    <!-- svelte-ignore a11y-media-has-caption -->
    <video class="fblackout" src={url} bind:currentTime={current} bind:duration />
    <!-- svelte-ignore a11y-media-has-caption -->
    <video class="faccele" src={url} bind:currentTime={current} bind:duration />
</div>
<div class="control timeline">
    <button on:click={prev}>prev</button>
    <div id="bar" class="bar" on:click|self={clickBar} bind:this={bar}>
        <div class="current" style="width:{getPos(current)}%" />
        {#each markers as marker, i}
            <div id={marker.label} class="marker" style="left:{getPos(marker.time)}%; height:{i * 2 + 4}em">
                <button class="setTime" on:click|stopPropagation={() => setTime(i)} />
                <p on:click|stopPropagation={() => moveTo(marker.time)}>{marker.label}:{marker.time}</p>
            </div>
        {/each}
        <div class="marker" style="left:{getPos(current)}%; height:{markers.length * 2 + 4}em">
            <p>current:{current}</p>
        </div>
    </div>
    <button on:click={next}>next</button>
</div>
<div class="info">
    <div class="realtime">
        <div class="wrapper">
            <div class="idle" style="width:{getPos(markers[0].time)}%;" />
            <div class="blackout" style="width:{getPos(s3r_blackout)}%">
                <p>blackout</p>
                <p>{s3r_blackout}</p>
                <p>{s3g_blackout}</p>
            </div>
            <div class="duration" style="width:{getPos(s3r_duration)}%">
                <p>duration</p>
                <p>{s3r_duration}</p>
                <p>{s3g_duration}</p>
                <div class="wrapper">
                    <div class="acceleration" style="width:{(100 * getPos(s3r_accel)) / getPos(s3r_duration)}%">
                        <p>acceleration</p>
                        <p>{s3r_accel}</p>
                        <p>{s3g_accel}</p>
                    </div>
                </div>
                <div class="wrapper">
                    <div class="combination" style="width:{(100 * getPos(s3r_comb)) / getPos(s3r_duration)}%">
                        <p>combination</p>
                        <p>{s3r_comb}</p>
                        <p>{s3g_comb}</p>
                    </div>
                    <div class="gap" style="width:{(100 * getPos(s3r_gap)) / getPos(s3r_duration)}%">
                        <p>gap</p>
                        <p>{s3r_gap}</p>
                        <p>{s3g_gap}</p>
                    </div>
                </div>
            </div>
            <div class="blackout" style="width:{getPos(s3r_blackout2)}%">
                <p>blackout</p>
                <p>{s3r_blackout2}</p>
                <p>{s3g_blackout}</p>
            </div>
            <div class="duration" style="width:{getPos(s3r_duration)}%">
                <p>duration</p>
                <p>{s3r_duration}</p>
                <p>{s3g_duration}</p>
                <div class="wrapper">
                    <div class="acceleration" style="width:{(100 * getPos(s3r_accel2)) / getPos(s3r_duration)}%">
                        <p>acceleration</p>
                        <p>{s3r_accel2}</p>
                        <p>{s3g_accel}</p>
                    </div>
                </div>
                <div class="wrapper">
                    <div class="combination" style="width:{(100 * getPos(s3r_comb)) / getPos(s3r_duration)}%">
                        <p>combination</p>
                        <p>{s3r_comb}</p>
                        <p>{s3g_comb}</p>
                    </div>
                    <div class="gap" style="width:{(100 * getPos(s3r_gap)) / getPos(s3r_duration)}%">
                        <p>gap</p>
                        <p>{s3r_gap}</p>
                        <p>{s3g_gap}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
