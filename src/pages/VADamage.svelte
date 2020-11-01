<script>
    import { f3 } from '../lib/util.js';
    import HelpItem from '../components/HelpItem.svelte';
    import SeekBar from '../components/SeekBar.svelte';
    import ZoomableVideo from '../components/ZoomableVideo.svelte';
    import DamageInput from '../components/DamageInput.svelte';
    export let url;
    let current = 0;
    let videoDuration = 1;
    let damages = [{ damage: 0, crit: true }];
    let critRate = 1.5;
    let total = 0;
    $: {
        let sum = 0;
        for (let entry of damages) {
            sum += entry.crit ? entry.damage : entry.damage * critRate;
        }
        total = sum;
    }

    let lang = 'en';
    let type = '';
    import data from './duration_flow.js';
    let offset = 0;
    let skills = [];
    const POSTFIX_1ST = '-#1';
    const POSTFIX_2ND = '-#2';
    const POSTFIX_1ST_P1 = '-#1.1';
    const POSTFIX_1ST_P2 = '-#1.2';
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
    <div class="help">w8 documentation</div>
    <!-- svelte-ignore a11y-media-has-caption -->
    <ZoomableVideo src={url} bind:currentTime={current} bind:duration={videoDuration} />
    <div id="damage-records">
        <div class="total">total: {total}</div>
        {#each damages as entry, index}
            <DamageInput
                {index}
                bind:damage={entry.damage}
                bind:crit={entry.crit}
                bind:critRate
                onInput={() => {
                    if (damages[damages.length - 1].damage !== 0) {
                        damages.push({ damage: 0, crit: true });
                    }
                }}
                onClickRemove={() => {
                    if (damages.length > 1) {
                        damages = damages.filter((m) => m !== entry);
                    }
                }} />
        {/each}
    </div>
</div>

<SeekBar id="timeline" class="control" bind:current bind:videoDuration />
