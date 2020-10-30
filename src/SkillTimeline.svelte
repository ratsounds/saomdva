<script>
    import { blank_object } from 'svelte/internal';

    export let videoDuration;
    export let offset;
    export let skills;

    function getPos(time) {
        return (100 * time) / videoDuration;
    }
</script>

<style>
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
    .wrapper {
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

<div class="wrapper">
    <div class="offset" style="width:{getPos(offset)}%;" />
    {#each skills as skill}
        {#if skill.time.blackout > 0}
            <div class="blackout" style="width:{getPos(skill.time.blackout)}%">
                <p>blackout{skill.post.blackout}</p>
                <p>{skill.rt.blackout}</p>
                <p>{skill.gt.blackout}</p>
            </div>
        {/if}
        <div class="duration" style="width:{getPos(skill.time.duration)}%">
            <p>duration{skill.post.duration}</p>
            <p>{skill.rt.duration}</p>
            <p>{skill.gt.duration}</p>
            <div class="wrapper">
                {#if skill.time.acc > 0}
                <div class="acceleration" style="width:{(100 * getPos(skill.time.acc)) / getPos(skill.time.duration)}%">
                    <p>acceleration{skill.post.acc}</p>
                    <p>{skill.rt.acc}</p>
                    <p>{skill.gt.acc}</p>
                </div>
                {/if}
            </div>
            <div class="wrapper">
                {#if skill.time.comb > 0}
                <div class="combination" style="width:{(100 * getPos(skill.time.comb)) / getPos(skill.time.duration)}%">
                    <p>combination{skill.post.comb}</p>
                    <p>{skill.rt.comb}</p>
                    <p>{skill.gt.comb}</p>
                </div>
                {/if}
                {#if skill.time.gap > 0}
                    <div class="gap" style="width:{(100 * getPos(skill.time.gap)) / getPos(skill.time.duration)}%">
                        <p>gap{skill.post.gap}</p>
                        <p>{skill.rt.gap}</p>
                        <p>{skill.gt.gap}</p>
                    </div>
                {/if}
            </div>
        </div>
    {/each}
</div>
