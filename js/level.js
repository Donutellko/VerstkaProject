const app = angular.module("app", []);
const label = document.getElementById('label');

const isLiveEdit = location.href.match(/https?:\/\/localhost:\d{5}\/.+/).length > 0;
const isLocalhost = location.href.match(/https?:\/\/localhost:\d+\/.+/).length > 0 || location.href.match(/^file:\/\/\//);

const CLASS_PIXEL = "pixel";
const CLASS_DEAD = "dead";

const CLASS_WALL = "wall";
const CLASS_BARRIER = "barrier";
const CLASS_EAGLE = "eagle";
const CLASS_ENEMY = "enemy";
const CLASS_PLAYER = "player";
const CLASS_BULLET = "bullet";

const STEP_TIMEOUT = 300;

const MODES = {
    TURRET: "guard",
    wait: "wait"
};

const UP = "UP";
const RIGHT = "RIGHT";
const DOWN = "DOWN";
const LEFT = "LEFT";

const DIR = {
    UP: 0,
    RIGHT: 90,
    DOWN: 180,
    LEFT: 270,
};

const SCORES = {
    [CLASS_WALL]: 10,
    [CLASS_ENEMY]: 100,
    [CLASS_BULLET]: 0
};

const levels = [{
    id: 1,
    title: "2-Д",
    img: "img/level_2d.png",
    lives: 3,
    field: `----#@#----
            --&-*-*----
            #*------&*-
            &----*---*-
            -*-***----
            -*---*---*-
            -*-------*#
            ----#**---&
            &-***$#---`,
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
        $scope.meta.title = level.title;
        $scope.meta.score = localStorage["score"] | 0;
        window.field = parseField($scope.meta.field);
        for (let i in field.enemies) {
            let unit = field.enemies[i];
            unit.dir = $scope.meta.enemies[i].dir;
            unit.mode = $scope.meta.enemies[i].mode;
            unit.offset = $scope.meta.enemies[i].offset;
            unit.period = $scope.meta.enemies[i].period;
            moveUnit(unit)
        }
        field.player.dir = $scope.level.player.dir;
        moveUnit(field.player)
    };

    loadGame();
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

function getCoordDeltasByDir(deg) {
    let dir = Math.abs((360 + (deg % 360)) % 360);
    return {
        x: (dir === 90 ? +1 : dir === 270 ? -1 : 0),
        y: (dir === 180 ? +1 : dir === 0 ? -1 : 0)
    };
}

function onkeypress(event) {
    let key = event.code;
    if (!arena.ready) return;
    let player = field.player;

    if (!player.alive) {
        showMessage("Игра окончена.");
        return;
    }

    let newX = player.x;
    let newY = player.y;

    // on move use these deltas
    let coordDelta = getCoordDeltasByDir(player.dir);

    let triggerStep = false;
    switch (key) {
        case "Space":
            fire(player);
            triggerStep = true;
            break;
        case "ArrowLeft":
        case "KeyA":
            player.dir -= 90;
            triggerStep = true;
            break;
        case "ArrowRight":
        case "KeyD":
            player.dir += 90;
            triggerStep = true;
            break;
        case "ArrowUp":
        case "KeyW":
            newX += coordDelta.x;
            newY += coordDelta.y;
            break;
        case "ArrowDown":
        case "KeyS":
            newX -= coordDelta.x;
            newY -= coordDelta.y;
            break;
        default:
            triggerStep = false;
            return;
    }
    let collision = getUnit(newX, newY);
    if (collision == null
        || collision.class === CLASS_BULLET && collision.dir !== player.dir
        || collision.class === CLASS_EAGLE) {
        player.x = newX;
        player.y = newY;
        triggerStep = true;
    }
    moveUnit(field.player);  // move or rotate elem according to new position
    if (triggerStep) step();
}

function fire(unit) {
    let bullet = {
        x: unit.x,
        y: unit.y,
        dir: unit.dir,
        alive: true,
        class: CLASS_BULLET,
        from: unit.class
    };
    showUnit(bullet);
    field.bullets.push(bullet);
    moveUnitRn(bullet);
}

function getUnit(x, y) {
    let collides = (unit) => unit.alive && unit.x === x && unit.y === y;
    for (let unit of field.enemies) if (collides(unit)) return unit;
    for (let unit of field.walls) if (collides(unit)) return unit;
    for (let unit of field.bullets) if (collides(unit)) return unit;
    if (collides(field.player)) return field.player;
    if (collides(field.eagle)) return field.eagle;

    if (x < 0 || y < 0 || x >= field.w || y >= field.h) return true;
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

function moveUnit(unit) { // move with little timeout, when unit shoul smoothly transition
    setTimeout(() => moveUnitRn(unit), 1);
}

function moveUnitRn(unit) { // move right now (when unit should just appear)
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
                y: parseInt(y),
                dir: 0,
                alive: true,
            };
            switch (unit.class) {
                case CLASS_WALL:
                case CLASS_BARRIER:
                    field.walls.push(unit);
                    break;
                case CLASS_ENEMY:
                    field.enemies.push(unit);
                    break;
                case CLASS_EAGLE:
                    field.eagle = unit;
                    break;
                case CLASS_PLAYER:
                    field.player = unit;
                    break;
                case null:
                    break;
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
    arena.ready = false
    if (field.player.x === field.eagle.x && field.player.y === field.eagle.y) {
        $scope.meta.score += SCORES[CLASS_EAGLE];
        return;
    }
    for (let enemy of field.enemies) {
        if (!enemy.alive) continue;
        if (enemy.mode === MODES.TURRET) {
            if (enemy.offset === 0) {
                fire(enemy);
                enemy.offset = enemy.period;
            }
            enemy.offset--;
        }
    }
    for (let bullet of field.bullets) {
        if (!bullet.alive) continue;
        stepBullet(bullet)
    }
    setTimeout(() => arena.ready = true, STEP_TIMEOUT);
    saveProgress();
}

function stepBullet(bullet) {
    let coordDelta = getCoordDeltasByDir(bullet.dir);
    let collision = getUnit(bullet.x + coordDelta.x, bullet.y + coordDelta.y); // if
    bullet.x += coordDelta.x;
    bullet.y += coordDelta.y;
    if (collision == null) {
        moveUnit(bullet);
        collision = getUnit(bullet.x + coordDelta.x, bullet.y + coordDelta.y);
        bullet.x += coordDelta.x;
        bullet.y += coordDelta.y;
    }
    if (collision != null) {
        kill(collision, bullet);
    }
    setTimeout(() => moveUnit(bullet), 10);
}

function kill(unit, bullet) {
    bullet.alive = false;
    setTimeout(() => bullet.elem.classList.add(CLASS_DEAD), STEP_TIMEOUT);

    switch (unit.class) {
        case CLASS_WALL:
        case CLASS_ENEMY:
        case CLASS_BULLET:
            unit.alive = false;
            if (bullet.from === CLASS_PLAYER) {
                $scope.meta.score += SCORES[unit.class];
            }
            $scope.$apply();
            setTimeout(() => unit.elem.classList.add(CLASS_DEAD), STEP_TIMEOUT);
            break;
        case CLASS_PLAYER:
            $scope.meta.lives--;
            showRed();
            if ($scope.meta.lives <= 0) {
                field.player.alive = false;
                gameOver(false);
            }
            $scope.$apply();
            break;
        case CLASS_EAGLE:
            gameOver(false);
    }
}

function loadGame() {
    if (localStorage.meta != null) {
        $scope.meta = JSON.parse(localStorage.meta);
    }

    if (localStorage.field != null) {
        window.field = JSON.parse(localStorage.field);
        $scope.field = field;
        showMessage("Загружено сохранение!");
    }
    return field == null;
}

function gameOver(win) {
    let message = win ? "Победа!" : "Поражение!";
    localStorage.field = null;
    showMessage(message);
}

function saveProgress() {
    localStorage.field = JSON.stringify(field);
    localStorage.meta = JSON.stringify($scope.meta);
}

function showMessage(message) {
    label.children[0].innerText = message;
    label.style.opacity = '100%';
    label.style.backgroundColor = 'rgba(0,0,0,0.5)';
    setTimeout(() => label.style.opacity = '0%', 1000);
}

function showRed() {
    label.children[0].innerText = '';
    label.style.opacity = '100%';
    label.style.backgroundColor = 'rgba(255,0,0,0.5)';
    setTimeout(() => label.style.opacity = '0%', 1000);
}