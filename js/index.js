const app = angular.module("app", []);

app.controller('indexCtrl', function ($scope, $http) {
    window.SCOPE = $scope;

    $scope.levels = [{
        id: 1,
        title: "2D",
        img: "img/level_2d.png",
        lives: 3
    }, {
        id: 2,
        title: "3D",
        img: "img/level_3d.png",
        lives: 5
    }];

});