'use strict';

var express = require('express');
var router = express.Router();
var restRequest = require('../helper/rest-request');

/* GET home page. */
router.get('/', function (req, res, next) {
  restRequest.use('treehole').get('/holes', next)
    .success(function (treeholes) {
      res.render('index', {
        treeholes: treeholes
      });
    });
});

module.exports = router;
