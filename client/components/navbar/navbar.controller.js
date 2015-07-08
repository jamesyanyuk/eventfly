'use strict';

angular.module('eventflyApp')
  .controller('NavbarCtrl', function ($scope, $location, Data) {
    $scope.Data = Data;

    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
