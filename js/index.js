const app = angular.module("app", []);

app.controller('indexCtrl', function ($scope, $http) {
    window.SCOPE = $scope;

    $scope.levels = LEVELS;

});