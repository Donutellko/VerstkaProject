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
