<script>
    import SkillTimeline from './SkillTimeline.svelte';
    let files;
    let url;
    let current = 0;
    let videoDuration = 1;
    const frameLength = 1 / 60;

    let bar;

    let lang = 'en';
    let type = '';
    import data from './data.js';
    let offset = 0;
    let skills = [];
    const POSTFIX_1ST = '-#1';
    const POSTFIX_2ND = '-#2';
    const POSTFIX_1ST_P1 = '-#1.1';
    const POSTFIX_1ST_P2 = '-#1.2';
    const POSTFIX_2ND_P1 = '-#2.1';
    const POSTFIX_2ND_P2 = '-#2.2';
    function f3(num) {
        return Math.floor(num * 1000) / 1000;
    }
    function getSkillTimeObject(blackout, duration, acc, comb, gap) {
        return {
            blackout: f3(blackout),
            duration: f3(duration),
            acc: f3(acc),
            comb: f3(comb),
            gap: f3(gap),
        };
    }
    function getPostfix(postfix) {
        return {
            blackout: postfix,
            duration: postfix,
            acc: postfix,
            comb: postfix,
            gap: postfix,
        };
    }
    $: {
        skills = [];
        const step = data.flows[type];
        let blackout, duration, acc, comb, gap, blackout2, acc2;
        let gt_comb, gt_acc, gt_duration;
        let accel_rate = 3;
        switch (type) {
            case '4*':
                offset = step[0].time;
                duration = step[1].time - step[0].time;
                skills.push({
                    post: getPostfix(POSTFIX_1ST),
                    time: getSkillTimeObject(0, duration, 0, 0, 0),
                    rt: getSkillTimeObject(0, duration, 0, 0, 0),
                    gt: getSkillTimeObject(0, duration, 0, 0, 0),
                });
                skills.push({
                    post: getPostfix(POSTFIX_2ND),
                    time: getSkillTimeObject(0, duration, 0, 0, 0),
                    rt: getSkillTimeObject(0, duration, 0, 0, 0),
                    gt: getSkillTimeObject(0, duration, 0, 0, 0),
                });
                break;
            case '5*':
                offset = step[0].time;
                duration = step[1].time - step[0].time;
                comb = step[2].time - step[1].time;
                skills.push({
                    post: getPostfix(POSTFIX_1ST),
                    time: getSkillTimeObject(0, duration, 0, comb, 0),
                    rt: getSkillTimeObject(0, duration, 0, comb, 0),
                    gt: getSkillTimeObject(0, duration, 0, comb, 0),
                });
                skills.push({
                    post: getPostfix(POSTFIX_2ND),
                    time: getSkillTimeObject(0, duration, 0, comb, 0),
                    rt: getSkillTimeObject(0, duration, 0, comb, 0),
                    gt: getSkillTimeObject(0, duration, 0, comb, 0),
                });
                break;
            case '6*':
                console.log(step);
                offset = step[0].time;
                blackout = step[1].time - step[0].time;
                acc = step[2].time - step[1].time;
                duration = step[3].time - step[1].time;
                blackout2 = step[4].time - step[3].time;
                acc2 = step[6].time - step[4].time;
                comb = step[5].time - step[4].time;
                gap = duration - comb;
                gt_acc = acc / accel_rate;
                gt_duration = gt_acc + duration - acc;
                gt_comb = comb < acc ? comb / accel_rate : gt_acc + comb - acc;
                skills.push({
                    post: getPostfix(POSTFIX_1ST),
                    time: getSkillTimeObject(blackout, duration, acc, comb, gap),
                    rt: getSkillTimeObject(blackout, duration, acc, comb, gap),
                    gt: getSkillTimeObject(0, gt_duration, gt_acc, gt_comb, gap),
                });
                skills.push({
                    post: getPostfix(POSTFIX_2ND),
                    time: getSkillTimeObject(blackout2, duration, acc2, comb, gap),
                    rt: getSkillTimeObject(blackout2, duration, acc2, comb, gap),
                    gt: getSkillTimeObject(0, gt_duration, gt_acc, gt_comb, gap),
                });
                break;
            case '6*xs':
                offset = step[0].time;
                blackout = step[1].time - step[0].time;
                comb = step[2].time - step[1].time;
                gt_comb = comb / accel_rate;
                skills.push({
                    post: getPostfix(POSTFIX_1ST_P1),
                    time: getSkillTimeObject(blackout, comb, comb, comb, 0),
                    rt: getSkillTimeObject(blackout, comb, comb, comb, 0),
                    gt: getSkillTimeObject(0, gt_comb, gt_comb, gt_comb, 0),
                });
                blackout2 = step[3].time - step[2].time;
                gap = step[5].time - step[3].time;
                acc = step[4].time - step[3].time;
                gt_acc = acc / accel_rate;
                skills.push({
                    post: getPostfix(POSTFIX_1ST_P1),
                    time: getSkillTimeObject(blackout2, gap, acc, 0, gap),
                    rt: getSkillTimeObject(blackout2, comb + gap, comb + acc, 0, gap),
                    gt: getSkillTimeObject(0, gt_comb + gap, gt_comb + gt_acc, 0, gap),
                });

                break;
        }
    }

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
    function moveTo(time) {
        current = time;
    }
    function setTime(key, i) {
        data.flows[key][i].time = current;
    }

    function activate(src, index) {
        for (let key in data.resources) {
            data.resources[key].active = false;
        }
        const steps = src === 'help' ? data.help : data.flows[src];
        steps[index].active = true;
        Array.from(document.getElementsByClassName('action')).forEach((elem) => {
            elem.classList.remove('action');
        });
        const action = steps[index].action;
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

    #select_type {
        display: flex;
        margin: 1em 0;
    }
    #select_type button {
        border: 1px solid #fff;
        padding: 0;
        flex: 1;
    }
    #select_type button.active {
        background-color: #fff;
        color: #444;
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
        background-color: #fc0;
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
        height: 20em;
    }
    .info * {
        text-indent: 0.5em;
    }
    .realtime {
        color: #444;
        padding: 0 5em;
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
        {#each data.help as step, i}
            <div class="step {step.active ? 'active' : ''}">
                <h2 on:click={() => activate('help', i)}>{step.title}</h2>
                {#each step[lang] as html}
                    <p>
                        {@html html}
                    </p>
                {/each}
            </div>
        {/each}
        <div id="select_type">
            {#each Object.keys(data.flows) as key}
                {#if key}
                    <button
                        class={type === key ? 'active' : ''}
                        on:click={() => {
                            type = key;
                        }}>{key}</button>
                {/if}
            {/each}
        </div>
        {#each data.flows[type] as step, i}
            <div class="step {step.active ? 'active' : ''}">
                <h2 on:click={() => activate(type, i)}>{i}. {step.title}</h2>
                {#each step[lang] as html}
                    <p>
                        {@html html}
                    </p>
                {/each}
            </div>
        {/each}
    </div>
    <!-- svelte-ignore a11y-media-has-caption -->
    <video src={url} bind:currentTime={current} bind:duration={videoDuration} />
    <!-- svelte-ignore a11y-media-has-caption -->
    <video class="fblackout" src={url} bind:currentTime={current} bind:duration={videoDuration} />
    <!-- svelte-ignore a11y-media-has-caption -->
    <video class="faccele" src={url} bind:currentTime={current} bind:duration={videoDuration} />
</div>
<div class="control timeline">
    <button on:click={prev}>prev</button>
    <div id="bar" class="bar" on:click|self={clickBar} bind:this={bar}>
        <div class="current" style="width:{getPos(current)}%" />
        {#each data.flows[type] as marker, i}
            {#if marker.action !== 'result'}
            <div id={marker.action} class="marker" style="left:{getPos(marker.time)}%; height:{i * 2 + 4}em">
                <button class="setTime" on:click|stopPropagation={() => setTime(type, i)} />
                <p on:click|stopPropagation={() => moveTo(marker.time)}>{marker.action}:{f3(marker.time)}</p>
            </div>
            {/if}
        {/each}
        <div class="marker" style="left:{getPos(current)}%; height:{data.flows[type].length * 2 + 2}em">
            <p>current:{f3(current)}</p>
        </div>
    </div>
    <button on:click={next}>next</button>
</div>
<div class="info" id="result">
    <div class="realtime">
        <SkillTimeline {videoDuration} {offset} {skills} />
    </div>
</div>
