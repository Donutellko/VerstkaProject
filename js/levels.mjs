
const CLASS_PIXEL = "pixel";
const CLASS_DEAD = "dead";

const CLASS_WALL = "wall";
const CLASS_BARRIER = "barrier";
const CLASS_EAGLE = "eagle";
const CLASS_ENEMY = "enemy";
const CLASS_PLAYER = "player";
const CLASS_BULLET = "bullet";

const STEP_TIMEOUT = 300;

const SCORES = {
    [CLASS_WALL]: 10,
    [CLASS_ENEMY]: 100,
    [CLASS_BULLET]: 0,
    [CLASS_EAGLE]: 500,
};

const MODES = {
    TURRET: "guard",
    wait: "wait"
};

const DIR = {
    UP: 0,
    RIGHT: 90,
    DOWN: 180,
    LEFT: 270,
};

let TYPES = {
    '*': CLASS_WALL,
    '#': CLASS_BARRIER,
    '$': CLASS_EAGLE,
    '&': CLASS_ENEMY,
    '@': CLASS_PLAYER,
    '-': null
};

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
