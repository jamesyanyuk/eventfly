'use strict';

angular.module('eventflyApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyAxS234dtYNRY1iDam8b8g4jNwbHXTxQDE',
      v: '3.17',
      libraries: 'weather,geometry,visualization'
    });

    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
