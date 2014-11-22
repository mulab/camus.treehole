'use strict';

var express = require('express');
var router = express.Router();
var http = require("http");

router.get('/:id', function(req, res) {
  var options = {
    host: '127.0.0.1',
    port: 9000,
    path: '/api/v1/holes/' + req.param('id'),
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  http.request(options, function(ress){
    var temp = "";
    ress.on('data', function (chunk) {
      temp += chunk;
    });

    ress.on('end', function () {
      res.render('hole/show', {
        treehole: JSON.parse(temp)
      });
    });

  }).end();
});


module.exports = router;
