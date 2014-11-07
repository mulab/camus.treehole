'use strict';

var express = require('express');
var router = express.Router();
var http = require("http");

/* GET home page. */
router.get('/', function(req, res) {

  var options = {
    host: 'private-e37e7-treeholeapis.apiary-mock.com',
    path: '/holes',
    method: 'GET',
    data: "{'number':'2'}",
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
        title: temp.toString(),
        treeholes: temp
      });
      console.log(temp.toString());
    });

  }).end()


});


module.exports = router;
