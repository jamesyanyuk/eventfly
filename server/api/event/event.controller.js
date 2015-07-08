'use strict';

var _ = require('lodash');
var Event = require('./event.model');

var eventbriteAPILib = require('node-eventbrite');
var EVENTBRITE_TOKEN = 'CJ5XPOJ25C5YP2YATIU2';

try {
  var eventbriteAPI = eventbriteAPILib({
    token: EVENTBRITE_TOKEN,
    version : 'v3'
  });
} catch (error) {
  console.log(error.message); // the options are missing, this function throws an error.
}

// Get list of events
exports.index = function(req, res) {
  //Event.find(function (err, events) {
  //  if(err) { return handleError(res, err); }
  //  return res.json(200, events);
  //});

  var radius = (function() {
    if(req.query.radius < 1)
      return '1mi';
    else if(req.query.radius > 1000)
      return '1000mi';
    else
      return req.query.radius + 'mi';
  })();
  var latitude = req.query.latitude;
  var longitude = req.query.longitude;

  if(!latitude || !longitude || !radius)
    return handleError(res, "Invalid latitude/longitude.");

  eventbriteAPI.search({
    'location.within': radius,
    'location.latitude': latitude,
    'location.longitude': longitude
  }, function(error, data) {
    if(error)
      handleError(res, error);
    else
      return res.json(200, data);
  });
};

// Get a single event
exports.show = function(req, res) {
  Event.findById(req.params.id, function (err, event) {
    if(err) { return handleError(res, err); }
    if(!event) { return res.send(404); }
    return res.json(event);
  });
};

// Creates a new event in the DB.
exports.create = function(req, res) {
  Event.create(req.body, function(err, event) {
    if(err) { return handleError(res, err); }
    return res.json(201, event);
  });
};

// Updates an existing event in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Event.findById(req.params.id, function (err, event) {
    if (err) { return handleError(res, err); }
    if(!event) { return res.send(404); }
    var updated = _.merge(event, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, event);
    });
  });
};

// Deletes a event from the DB.
exports.destroy = function(req, res) {
  Event.findById(req.params.id, function (err, event) {
    if(err) { return handleError(res, err); }
    if(!event) { return res.send(404); }
    event.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
