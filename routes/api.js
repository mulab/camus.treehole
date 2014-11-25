/**
 * Created by guangchen on 10/26/14.
 */
'use strict';

var express = require('express');
var router = express.Router();
var db = require('../config/db').db();

router.get('/status', function (req, res, next) {
  db.collection('holes', {strict: true}, function (err, collection) {
    if (err) {
      err.status = 500;
      next(err);
    } else {
      res.sendStatus(200);
    }
  });
});

require('./api/treehole')(router);

module.exports = router;
