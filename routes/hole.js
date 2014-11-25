'use strict';

var express = require('express');
var router = express.Router();
var restfulApiHelper = require('../helper/restful-api-helper');

router.post('/', function (req, res, next){
  var textContent = req.param('txtContent');
  if (textContent.length === 0) {
    return;
  }
  var hole = {};
  hole.text = textContent;
  hole.feedbacks = req.param('feedbacks').split('\t');
  hole.channel = "testChannel";
  restfulApiHelper.post('/api/v1/holes', hole, function (status, result) {
    res.redirect('/');
  });
});

router.get('/:id', function(req, res, next) {
  restfulApiHelper.get('/api/v1/holes/' + req.param('id'), {}, function (status, result) {
    if (status !== 200) {
      var err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }
    var treehole = JSON.parse(result);
    restfulApiHelper.get('/api/v1/holes/' + req.param('id') + '/comments', {}, function (status, result) {
      if (status !== 200) {
        var err = new Error('Not Found');
        err.status = 404;
        return next(err);
      }
      var comments = JSON.parse(result);
      res.render('hole/show', {
        treehole: treehole,
        comments: comments
      });
    });
  });
});

router.post('/:id/comment', function (req, res, next) {
  var hole_id = req.param('id');
  var feedbacks = req.param('feedbacks').split('\t');
  var params = {
    hole_id: hole_id,
    text: req.param('comment-text'),
    feedbacks: feedbacks
  };
  restfulApiHelper.post('/api/v1/holes/' + hole_id + '/comments', params, function (status, result) {
    res.redirect('/hole/' + hole_id);
  });
});

router.post('/:hole_id/feedbacks/:feedback_id', function (req, res, next) {
  restfulApiHelper.post('/api/v1/holes/' + req.param('hole_id') + '/feedbacks/'
    + req.param('feedback_id'), {action:req.param('action')}, function (status, result) {
    res.send(result);
  });
});

module.exports = router;
