<script>
    import { f3 } from '../lib/util.js';
    import HelpItem from '../components/HelpItem.svelte';
    import SeekBar from '../components/SeekBar.svelte';
    import Marker from '../components/Marker.svelte';
    import SkillTimeline from '../components/SkillTimeline.svelte';
    export let url;
    let current = 0;
    let videoDuration = 1;

    let lang = 'en';
    let type = '';
    import data from './duration_flow.js';
    let offset = 0;
    let skills = [];
    const POSTFIX_1ST = '-#1';
    const POSTFIX_2ND = '-#2';
    const POSTFIX_1ST_P1 = '-#1.1';
    const POSTFIX_1ST_P2 = '-#1.2';
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
                    post: getPostfix(POSTFIX_1ST_P2),
                    time: getSkillTimeObject(blackout2, gap, acc, 0, gap),
                    rt: getSkillTimeObject(blackout2, comb + gap, comb + acc, 0, gap),
                    gt: getSkillTimeObject(0, gt_comb + gap, gt_comb + gt_acc, 0, gap),
                });

                break;
        }
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
        const steps = data[src] ? data[src] : data.flows[src];
        steps[index].active = true;
        Array.from(document.getElementsByClassName('action')).forEach((elem) => {
            elem.classList.remove('action');
        });
        const action = steps[index].action;
        if (action) {
            const target = document.getElementById(action);
            if (target) {
                target.classList.add('action');
            }
        }
    }
</script>

<div class="videos">
    <div class="help">
        {#if type === ''}
            {#each data.help as item, i}
                <HelpItem bind:item bind:lang onClickHeader={() => activate('help', i)} />
            {/each}
        {/if}
        {#each data.static as item, i}
            <HelpItem bind:item bind:lang onClickHeader={() => activate('static', i)} />
        {/each}
        <div id="select_type">
            {#each Object.keys(data.flows) as key}
                {#if key}
                    <button
                        class={type === key ? 'active' : ''}
                        on:click={() => {
                            type = type === key ? '' : key;
                        }}>{key}</button>
                {/if}
            {/each}
        </div>
        {#each data.flows[type] as item, i}
            <HelpItem bind:item bind:lang onClickHeader={() => activate(type, i)} />
        {/each}
    </div>
    <!-- svelte-ignore a11y-media-has-caption -->
    <video src={url} bind:currentTime={current} bind:duration={videoDuration} />
    <!-- svelte-ignore a11y-media-has-caption -->
    <video class="fblackout" src={url} bind:currentTime={current} bind:duration={videoDuration} />
    <!-- svelte-ignore a11y-media-has-caption -->
    <video class="faccele" src={url} bind:currentTime={current} bind:duration={videoDuration} />
</div>

<SeekBar id="timeline" class="control" bind:current bind:videoDuration>
    {#each data.flows[type] as marker, i}
        {#if marker.action !== 'result'}
            <Marker
                id={marker.action}
                time={marker.time}
                {videoDuration}
                height={i * 2 + 4}
                label={marker.action}
                onClickButton={() => setTime(type, i)}
                onClickLablel={() => moveTo(marker.time)} />
        {/if}
    {/each}
    <Marker time={current} {videoDuration} height={data.flows[type].length * 2 + 2} label="current" />
</SeekBar>
<div id="result">
    <div class="realtime">
        <SkillTimeline {videoDuration} {offset} {skills} />
    </div>
</div>
