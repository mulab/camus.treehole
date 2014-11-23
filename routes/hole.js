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
  http.request(options, function(res1){
    var temp = "";
    res1.on('data', function (chunk) {
      temp += chunk;
    });

    res1.on('end', function () {
      options.path += '/comments';
      http.request(options, function(res2){
        var temp_comment = "";
        res2.on('data', function(chunk){
          temp_comment += chunk;
        });

        res2.on('end', function() {
          res.render('hole/show', {
            treehole: JSON.parse(temp),
            comments: JSON.parse(temp_comment)
          });
        });
      }).end();
    });

  }).end();
});

router.post('/:id/comment', function(req, res) {
  var options = {
    host: '127.0.0.1',
    port: 9000,
    path: '/api/v1/holes/' + req.param('id') + '/comments',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  var request = http.request(options, function(){
    res.redirect('/hole/' + req.param('id'));
  });
  var comment = {};
  comment.hole_id = req.param('id');
  comment.text = req.param('comment-text');
  request.write(JSON.stringify(comment));
  request.end();
});


module.exports = router;
