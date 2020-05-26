const app = angular.module("app", []);

const isLiveEdit = location.href.match(/https?:\/\/localhost:\d{5}\/.+/).length > 0;
const isLocalhost = location.href.match(/https?:\/\/localhost:\d+\/.+/).length > 0 || location.href.match(/^file:\/\/\//);

const levels = [{
    id: 1,
    title: "2D",
    img: "img/level_2d.png",
    lives: 3,
    field: {w: 10, h: 10}, // width and height of map
    walls: [
        {x: 0, y: 0},
        {x: 5, y: 5},
    ]
}, {
    id: 2,
    title: "3D",
    img: "img/level_3d.png",
    lives: 5
}];

app.controller('levelCtrl', function ($scope) {
    window.$scope = $scope;

    $scope.level = getLevel(parseMetadata().id);

    $scope.start = function(level) {
        $scope.meta = JSON.parse(JSON.stringify(level));
        $scope.cell_w = 100 / $scope.meta.field.w;
        $scope.cell_h = 100 / $scope.meta.field.h;
    };

    $scope.start($scope.level);

    $scope.lives = function (max, actual) {
        lives = [];
        for (let i = 0; i < max; i++) {
            lives.push(i < actual);
        }
        return lives;
    }
});

function getLevel(id) {
    return levels[id - 1];
}

function parseMetadata() {
    let id = location.href.match(/id=([^#&]+)/)[1];
    return {
        id: id,
    }
}