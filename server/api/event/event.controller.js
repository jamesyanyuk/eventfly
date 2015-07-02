'use strict';

var _ = require('lodash');
var Event = require('./event.model');

var http = require('http');

var EVENTBRITE_TOKEN = 'CJ5XPOJ25C5YP2YATIU2';

// Get list of events
exports.index = function(req, res) {
  //Event.find(function (err, events) {
  //  if(err) { return handleError(res, err); }
  //  return res.json(200, events);
  //});

  http.get('https://www.eventbriteapi.com/v3/events/search/?token=CJ5XPOJ25C5YP2YATIU2&limit=2', function(res) {
    return res.json(200, res);
  }).on('error', function(err) {
    return handleError(res, err);
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