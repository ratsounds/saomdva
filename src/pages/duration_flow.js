const resources = {
    overview: {
        title: 'overview',
        en: ['this web app is a tool for sao:md skill durations video analysis.'],
        active: true,
        action: 'logo',
    },
    take_video: {
        title: 'take a video',
        en: [
            "take a video that consists of analysis unit's multiple ss3 and combination or XS from analysis target unit into support unit.all ss3 input should be bufferd without delay.",
            "video should be consist from follows where analysis target is A,combination partner is B, [*] is combination, and {*} is XS.",
            "under 4star: A > A",
            "under 5star: A > [A > B]",
            "under 6star: A > [A > B]",
            "under 6star: A > {A > B}",
        ],
        action: 'logo',
    },
    open_video: { title: 'open video', en: ["open ss3 video from 'open' at right upper."], action: 'open' },
    seek_video: {
        title: 'seek video',
        en: ['click bottom seek bar for roughly seeking.', 'click prev or next button for 1/60 frame seeking'],
        action: 'bar',
    },
    set_marker: {
        title: 'set marker pos',
        en: [
            'indicator with circle and label at the bottom of seek bar is marker to control specific time frames for ss3 durations calculation in video timeline.',
            'click left circle: set marker position to current position',
            'click right label:  set current position to marker positon',
        ],
        action: 'skill_on',
    },
    select_type: {
        title: 'select unit type',
        en: [
            'select unit type from following selecter or click selected to unselect.',
        ],
        action: 'select_type',
    },
    skill_on: {
        title: 'find skill_on',
        en: [
            'skill_on is a frame that ss3 is activated.',
            'this frame can be found by mp change. at the same frame, blackout effect is activated on 6* units.',
        ],
        action: 'skill_on',
    },
    acc_on: {
        title: 'find acc_on',
        en: [
            'acc_on is a frame that acceleration is activated.',
            'this frame can be found by fade in of acceleration effect on right high contrasted video or fade out of blackout effect on center high saturated video.',
            'note that the timing of acceleration effect fade in get 1_3 frame delay by hardware, os and processing load.',
        ],
        action: 'acc_on',
    },
    mid_on: {
        title: 'find mid_on',
        en: ['mid_on is a frame that mid_blackout effect is activated in XS units.'],
        action: 'mid_on',
    },
    mid_off: {
        title: 'find mid_off ',
        en: ['mid_off  is a frame that mid_blackout effect is deactivated in XS units.'],
        action: 'mid_off ',
    },
    acc_off: {
        title: 'find acc_off',
        en: [
            'acc_off is a frame that acceleration is deactivated.',
            'this frame can be found by fade out of acceleration effect on right high contrasted video.',
        ],
        action: 'acc_off',
    },
    skill_on_2: {
        title: 'find skill_on_2',
        en: ['skill_on_2 is a frame that 2nd ss3 is activated.', "it is same as 'find skill_on'"],
        action: 'skill_on_2',
    },
    acc_on_2: {
        title: 'find acc_on_2',
        en: ["acc_on_2 is a frame that 2nd ss3's acceleration is activated.", "it is same as 'find acc_on_2'"],
        action: 'acc_on_2',
    },
    acc_off_2: {
        title: 'find acc_off_2',
        en: ["acc_off_2 is a frame that 2nd ss3' acceleration is deactivated.", "it is same as 'find acc_off_2'"],
        action: 'acc_off_2',
    },
    comb_on: {
        title: 'find comb_on',
        en: [
            "comb_on is a frame that combination partner's ss3 is activated.",
            'this frame can be found by same as skill_on and skill_on_2. anoter way is name change at left top hp/mp indicator.',
        ],
        action: 'comb_on',
    },
    done: {
        title: 'done!',
        en: [
            "check bottom ss3 timeline.",
            'R: Real time duration',
            'G: in-Game duration'
        ],
        action: 'result',
    }
};

export default {
    resources: resources,
    help: [
        resources.overview,
        resources.take_video,
        resources.open_video,
        resources.seek_video,
        resources.set_marker,
    ],
    static: [
        resources.select_type,
    ],
    flows: {
        '': [],
        '4*': [
            resources.skill_on,
            resources.skill_on_2,
            resources.done,
        ],
        '5*': [
            resources.skill_on,
            resources.skill_on_2,
            resources.comb_on,
            resources.done,
        ],
        '6*': [
            resources.skill_on,
            resources.acc_on,
            resources.acc_off,
            resources.skill_on_2,
            resources.acc_on_2,
            resources.comb_on,
            resources.acc_off_2,
            resources.done,
        ],
        '6*xs': [
            resources.skill_on,
            resources.acc_on,
            resources.mid_on,
            resources.mid_off,
            resources.acc_off,
            resources.skill_on_2,
            resources.done,
        ]
    }
}
