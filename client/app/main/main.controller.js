'use strict';

angular.module('eventflyApp')
  .controller('MainCtrl', function ($scope, $http, uiGmapGoogleMapApi, $window, Data) {
    $scope.Data = Data;
    $scope.Data.eventRadius = 20;

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

    $scope.eventMarkers = [];
    $scope.eventResults = [
      {
        name: 'Test Event One',
        location: 'Boston, MA',
        desc: 'Some first random event for testing',
        logo: 'http://a2.mzstatic.com/us/r30/Purple7/v4/97/35/db/9735db91-2e39-60cd-a3e2-19587e127e82/icon175x175.png'
      },
      {
        name: 'Test Event Two',
        location: 'Somerville, MA',
        desc: 'Some other random event for testing',
        logo: 'http://a2.mzstatic.com/us/r30/Purple7/v4/97/35/db/9735db91-2e39-60cd-a3e2-19587e127e82/icon175x175.png'
      }
    ];

    uiGmapGoogleMapApi.then(function(maps) {
      console.log('Google Maps API Loaded.');

      $scope.markerOptions = {
        mainMarker: {
          draggable: true
        },
        eventMarkers: {
          animation: maps.Animation.DROP
        }
      };

      var styleArray = [
        {
          "featureType": "administrative",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "simplified"
            },
            {
              "hue": "#0066ff"
            },
            {
              "saturation": 74
            },
            {
              "lightness": 100
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "off"
            },
            {
              "weight": 0.6
            },
            {
              "saturation": -85
            },
            {
              "lightness": 61
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "simplified"
            },
            {
              "color": "#5f94ff"
            },
            {
              "lightness": 26
            },
            {
              "gamma": 5.86
            }
          ]
        }
      ];

      $scope.map = {
        center: { latitude: 45, longitude: -73 },
        zoom: 8, // orig 8
        options: {
          scrollwheel: false,
          streetViewControl: false,
          styles: styleArray
        },
        events: {
          click: function(map, eventName, eventArgs) {
            var ev = eventArgs[0];
            var lat = ev.latLng.lat();
            var lng = ev.latLng.lng();

            console.log($scope.eventRadius);
            loadEvents(lat, lng, $scope.Data.eventRadius);

            $scope.mainMarker = {
              id: 0,
              latitude: lat,
              longitude: lng,
              showWindow: false,
              events: {
                dragend: function() {
                  //TODO: BUG - FIX THIS
                  this.latitude = ev.latLng.lat();
                  this.longitude = ev.latLng.lng();

                  loadEvents(this.latitude, this.longitude, $scope.Data.eventRadius);
                }
              }
            };

            $scope.$apply();
          }
        }
      };

      $scope.eventClick = function(event) {
        $window.location.href = event.url;
      }
    });

    function createMarker(lat, lng) {
      var marker = {
        id: Math.floor((Math.random() * 1000000) + 1),
        coords: {
          latitude: lat,
          longitude: lng
        }
      }

      return marker;
    }

    function loadEvents(latitude, longitude, radius) {
      $scope.eventMarkers = [];
      $scope.eventResults = [];

      $http({
        url: '/api/events',
        method: 'GET',
        params: {
          latitude: latitude,
          longitude: longitude,
          radius: radius
        }
      }).success(function(data) {
        // Now we've retreieved all relevant events
        console.log(data.events);
        if(data.events.length > 0) {
          for(var i in data.events) {
            //var marker = createMarker(data.events[i].location.latitude, data.data[ind].location.longitude);
            //$scope.igMarkers.push(marker);

            var resultItem = {
              name: data.events[i].name.text,
              location: 'Boston, MA',
              desc: 'Some first random event for testing',
              url: data.events[i].url,
              logo: data.events[i].logo ? data.events[i].logo.url : 'http://a2.mzstatic.com/us/r30/Purple7/v4/97/35/db/9735db91-2e39-60cd-a3e2-19587e127e82/icon175x175.png'
            }
            $scope.eventResults.push(resultItem);
          }
        }
      });
    }
  });
