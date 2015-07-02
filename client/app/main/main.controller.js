'use strict';

angular.module('eventflyApp')
  .controller('MainCtrl', function ($scope, $http, uiGmapGoogleMapApi) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    uiGmapGoogleMapApi.then(function(maps) {
      console.log('Google Maps API Loaded.');

      $scope.markerOptions = {
        mainMarker: {
          draggable: true
        },
        igMarkers: {
          animation: maps.Animation.DROP
        }
      };

      $scope.map = {
        center: { latitude: 45, longitude: -73 },
        zoom: 8, // orig 8
        options: {
          scrollwheel: false,
          streetViewControl: false
        },
        events: {
          click: function(map, eventName, eventArgs) {
            var ev = eventArgs[0];
            var lat = ev.latLng.lat();
            var lng = ev.latLng.lng();

            loadImages(lat, lng, 1000, $http, $scope);

            $scope.mainMarker = {
              id: 0,
              latitude: lat,
              longitude: lng,
              showWindow: false,
              events: {
                dragend: function() {
                  this.latitude = ev.latLng.lat();
                  this.longitude = ev.latLng.lng();

                  loadImages(this.latitude, this.longitude, 1000, $http, $scope);
                }
              }
            };

            $scope.$apply();
          }
        }
      };
    });
  });
