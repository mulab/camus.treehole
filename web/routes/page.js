'use strict';

var express = require('express');
var router = express.Router();
var restfulApiHelper = require('../helper/restful-api-helper');

/* GET home page. */
router.get('/', function (req, res, next) {
  restfulApiHelper.get('/api/v1/holes', {}, function (status, result) {
    if (status !== 200) {
      var err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }
    res.render('index', {
      treeholes: JSON.parse(result)
    });
  });
});

module.exports = router;