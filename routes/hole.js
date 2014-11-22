'use strict';

var express = require('express');
var router = express.Router();
var http = require("http");

router.get('/show', function(req, res) {
  res.render('hole/show');
});


module.exports = router;
