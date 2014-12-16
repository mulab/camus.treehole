'use strict';

var express = require('express');
var mongodb = require('mongodb');
var db = require('../config/db').db();
var router = express.Router();
var error = require('../../common/helper/error');

router.post('/', function (req, res, next) {
  db.collection('images').insert({ available: false }, function (err, result) {
    if (err) {
      return next(err);
    } else {
      res.status(201).send(result[0]);
    }
  });
});

router.get('/:id', function (req, res, next) {
  if (!mongodb.ObjectID.isValid(req.param('id'))) {
    return next(error('invalid image id', { status: 404 }));
  }
  db.collection('images').findOne({ _id: new mongodb.ObjectID(req.param('id')) }, function (err, image) {
    if (err) {
      return next(err);
    } else {
      res.send(image);
    }
  });
});

router.post('/:id/update', function (req, res, next) {
  if (!mongodb.ObjectID.isValid(req.param('id'))) {
    return next(error('invalid image id', { status: 404 }));
  }
  var query = { _id: new mongodb.ObjectID(req.param('id')) };
  var update = { available: req.param('available') };
  db.collection('images').update(query, update, function (err, result) {
    if (err) {
      return next(err);
    } else {
      if (result === 1) {
        res.sendStatus(201);
      } else {
        return next(error('invalid image id', { status: 404 }));
      }
    }
  });
});

module.exports = router;
