const app = angular.module("app", []);

const isLiveEdit = location.href.match(/https?:\/\/localhost:\d{5}\/.+/).length > 0;
const isLocalhost = location.href.match(/https?:\/\/localhost:\d+\/.+/).length > 0 || location.href.match(/^file:\/\/\//);

const CLASS_PIXEL = "pixel";
const CLASS_WALL = "wall";
const CLASS_BARRIER = "barrier";
const CLASS_EAGLE = "eagle";
const CLASS_ENEMY = "enemy";
const CLASS_PLAYER = "player";
const CLASS_BULLET = "bullet";

const MODES = {
    guard: "guard",
    wait: "wait"
};

const UP = "UP";
const RIGHT = "RIGHT";
const DOWN = "DOWN";
const LEFT = "LEFT";

let DIR = {
    UP: 0,
    RIGHT: 90,
    DOWN: 180,
    LEFT: 270,
};

const levels = [{
    id: 1,
    title: "2D",
    img: "img/level_2d.png",
    lives: 3,
    field: `----#@#----
            --&-*-*----
            -*------&*-
            -*---*---*-
            ----***----
            -*---*---*-
            -*-------*-
            ----***---&
            --&-#$#----`,
    enemies: [
        {dir: DIR.DOWN, mode: MODES.guard},
        {dir: DIR.LEFT, mode: MODES.wait},
        {dir: DIR.UP, mode: MODES.guard},
        {dir: DIR.LEFT, mode: MODES.guard},
    ],
    player: {x: 5, y: 9}
}, {
    id: 2,
    title: "3D",
    img: "img/level_3d.png",
    lives: 5
}];

let arena = {
    elem: document.getElementById('arena'),
    h: 60,      // arena height, vh
    w: null,    // arena width, vh
    cH: null,   // cell height, %
    cW: null,    // cell width, %
    ready: true, // ready for keypress
};

app.controller('levelCtrl', function ($scope) {
    window.$scope = $scope;

    $scope.level = getLevel(parseMetadata().id);

    $scope.start = function (level) {
        $scope.meta = JSON.parse(JSON.stringify(level));
        window.field = parseField($scope.meta.field);
        for (let i in field.enemies) {
            let unit = field.enemies[i];
            unit.dir = $scope.meta.enemies[i].dir;
            unit.mode = $scope.meta.enemies[i].mode;
            moveUnit(unit)
        }
    };

    $scope.start($scope.level);

    $scope.lives = function (max, actual) {
        lives = [];
        for (let i = 0; i < max; i++) {
            lives.push(i < actual);
        }
        return lives;
    };

    document.body.onkeydown = onkeypress;

});

let DIRECTIONS = {
    "ArrowUp": DIR.UP,
    "ArrowDown": DIR.DOWN,
    "ArrowLeft": DIR.LEFT,
    "ArrowRight": DIR.RIGHT,
};

let MOVEMENTS = {
    "KeyW": {x: 0, y: -1, dir: DIR.UP},
    "KeyS": {x: 0, y: 1, dir: DIR.DOWN},
    "KeyA": {x: -1, y: 0, dir: DIR.LEFT},
    "KeyD": {x: +1, y: 0, dir: DIR.RIGHT},
};

let KEY_FIRE = "Space";

function onkeypress(event) {
    let key = event.code;
    console.log(key);
    if (!arena.ready) return;
    if (key === KEY_FIRE) {
        fire(field.player);
    } else if (null != (view = DIRECTIONS[key])) {
        field.player.dir = view; // set direction
        moveUnit(field.player);  // rotate elem according to direction
    } else if (null != (move = MOVEMENTS[key])) {
        field.player.dir = move.dir; // set direction
        field.player.x += move.x; // set new x
        field.player.y += move.y; // set new y
        moveUnit(field.player);  // rotate elem according to new position
    }
    console.log(field.player);
}

function fire(unit) {
    let bullet = {
        x: unit.x,
        y: unit.y,
        dir: unit.dir,
        class: CLASS_BULLET,
    };
    field.bullets.push(bullet);
}

function getLevel(id) {
    return levels[id - 1];
}

function parseMetadata() {
    let id = location.href.match(/id=([^#&]+)/)[1];
    return {
        id: id,
    }
}

function showUnit(unit) {
    if (unit.class == null) return;

    let elem = document.createElement("div");

    elem.classList.add(CLASS_PIXEL);
    elem.classList.add(unit.class);

    elem.style.width = arena.cW;
    elem.style.height = arena.cH;

    unit.elem = elem;
    moveUnit(unit);

    arena.elem.appendChild(elem);
}

function moveUnit(unit) {
    unit.elem.style.transform = `translate(${unit.x * 100}%, ${unit.y * 100}%) rotate(${unit.dir | 0}deg)`;
}

let TYPES = {
    '*': CLASS_WALL,
    '#': CLASS_BARRIER,
    '$': CLASS_EAGLE,
    '&': CLASS_ENEMY,
    '@': CLASS_PLAYER,
    '-': null
};

function parseField(toParse) {
    let lines = toParse.trim().split('\n');
    let field = {
        w: lines[0].length,
        h: lines.length,
        walls: [],
        enemies: [],
        player: null,
        eagle: null,
        bullets: [],
    };
    prepareArena(field.w, field.h);

    for (let y in lines) {
        let line = lines[y].trim().split('');
        for (let x in line) {
            let char = line[x];
            let unit = {
                class: TYPES[char],
                x: parseInt(x),
                y: parseInt(y)
            };
            switch (unit.class) {
                case CLASS_WALL: field.walls.push(unit); break;
                case CLASS_ENEMY: field.enemies.push(unit); break;
                case CLASS_EAGLE: field.eagle = unit; break;
                case CLASS_PLAYER: field.player = unit; break;
                case null: break;
            }
            showUnit(unit);
        }
    }

    return field;
}


function prepareArena(w, h) { // width and height of field, in cells
    arena.w = (w * arena.h / h);

    arena.elem.style.height = arena.h + 'vh';
    arena.elem.style.width = arena.w + 'vh';

    arena.cH = (100 / h) + '%';
    arena.cW = (100 / w) + '%';
}

function step() {

}