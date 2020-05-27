LEVELS = [{
    id: 1,
    title: "2-Д",
    img: "img/level_2d.png",
    lives: 3,
    field: `
            ----#@#----
            --&-*-*----
            #*------&*-
            &----*---*-
            -*-***-----
            -*---*---*-
            -*-------*#
            ----#**---&
            &-***$#----
            `,
    enemies: [
        {dir: DIR.RIGHT, mode: MODES.TURRET, period: 3, offset: 0},
        {dir: DIR.LEFT, mode: MODES.TURRET, period: 3, offset: 2},
        {dir: DIR.RIGHT, mode: MODES.TURRET, period: 2, offset: 1},
        {dir: DIR.LEFT, mode: MODES.TURRET, period: 3, offset: 0},
        {dir: DIR.RIGHT, mode: MODES.TURRET, period: 7, offset: 5},
    ],
    player: {dir: DIR.DOWN}
}, {
    id: 2,
    title: "3-Д",
    img: "img/level_3d.png",
    field: `-----&-----
            ----&-&----
            #*&-----&*-
            &----*---*-
            -*-**-----$
            &----*---*-
            **-------*#
            ----#**---&
            &--*#@#---`,
    enemies: [
        {dir: DIR.DOWN, mode: MODES.TURRET, period: 4, offset: 0},
        {dir: DIR.DOWN, mode: MODES.TURRET, period: 4, offset: 1},
        {dir: DIR.DOWN, mode: MODES.TURRET, period: 4, offset: 2},
        {dir: DIR.DOWN, mode: MODES.TURRET, period: 4, offset: 3},
        {dir: DIR.DOWN, mode: MODES.TURRET, period: 4, offset: 2},
        {dir: DIR.RIGHT, mode: MODES.TURRET, period: 3, offset: 1},
        {dir: DIR.RIGHT, mode: MODES.TURRET, period: 3, offset: 2},
        {dir: DIR.LEFT, mode: MODES.TURRET, period: 7, offset: 5},
        {dir: DIR.RIGHT, mode: MODES.TURRET, period: 7, offset: 5},
    ],
    player: {dir: DIR.UP}
}];
