'use strict';
var express = require('express');
var mongodb = require('mongodb');
var db = require('../config/db').db();
var _ = require('lodash');
var router = express.Router();

router.get('/:id', function (req, res, next) {
  db.collection('channels').findOne({ channel_id: req.param('id') }, function (err, result) {
    if (err) {
      return next(err);
    }
    if (!result) {
      return next(error('invalid channel id', { status: 404 }));
    }
    res.send(result);
  });
});

module.exports = router;
