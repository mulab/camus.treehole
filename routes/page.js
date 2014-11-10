'use strict';

var express = require('express');
var router = express.Router();
var http = require("http");

/* GET home page. */
router.get('/', function(req, res) {

  var options = {
    host: '127.0.0.1',
    port: 9000,
    path: '/api/v1/holes',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  http.request(options, function(ress){
    var temp;
    ress.on('data', function (chunk) {
      temp = JSON.parse(chunk);
    });

    ress.on('end', function () {
      res.render('index', {
        treeholes: temp
      });
    });

  }).end()

});


module.exports = router;
