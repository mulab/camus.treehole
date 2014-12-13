'use strict';
var mongodb = require('mongodb');
var db = require('../config/db').db();
var _ = require('lodash');


module.exports = function (router) {
  // GET a channel use it's name
  router.get('/channels/:id', function (req, res, next) {
    db.collection('channels').findOne({ channel_id: req.param('id') }, function (err, result) {
      if (err) {
        return next(err);
      }
      if (!result) {
        err = new Error('Not Found');
        err.status = 404;
        return next(err);
      }
      res.send(result);
    });
  });
};
