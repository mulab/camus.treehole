/**
 * Created by guangchen on 10/26/14.
 */
'use strict';
var mongodb = require('mongodb');
var db = require('../../config/db').db();
/**
 *
 * @param router
 */
function tree_hole(router) {
  //POST /treehole: create tree-hole
  router.post('/holes', function (req, res) {
    var hole = {};
    hole.author = { uid: req.param('author') };
    hole.options = {
      channel_id: req.param('channel'),
      anonymous: req.param('anonymous')
    };
    hole.text = req.param('text');
    hole.image = req.param('images');
    hole.feedbacks = req.param('feedbacks');
    hole.references = req.param('references');
    hole.publish_time = Date();
    db.collection('holes').insert(hole, function (err, result) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        res.status(201).send(result[0]);
      }
    });
  });

  //GET /treehole: get tree-holes
  router.get('/holes', function (req, res) {
    var count = req.param('count', 10);
    var page = req.param('page', 1);
    var end_id = req.param('end_id');
    var options = {
      skip: (page - 1) * count,
      limit: count,
      sort: {"_id": -1}
    };
    var query = {
      _id: {$lt: new mongodb.ObjectID(end_id)}
    };
    db.collection('holes').find(query, options).toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        res.send(docs);
      }
    });
  });

  // GET /treehole/:id get agit  tree-hole
  router.get('/holes/:id', function (req, res) {
    db.collection('holes').findOne({_id: new mongodb.ObjectID(req.param('id'))}, function(err, result) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        res.send(result);
      }
    });
  });

  // GET a comment using hole id
  router.get('/holes/:hole_id/comments', function(req, res) {
    var count = req.param('count', 10);
    var page = req.param('page', 1);
    var end_id = req.param('end_id');
    var options = {
      skip: (page - 1) * count,
      limit: count,
      sort: {"_id": 1}
    };
    var query = {
      hole_id: req.param('hole_id'),
      _id: {$lt: new mongodb.ObjectID(end_id)}
    };
    db.collection('comments').find(query, options).toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        res.send(docs);
      }
    });
  });

  router.post('/holes/:hole_id/comments', function(req, res) {
    var comment = {};
    comment.hole_id = req.param('hole_id');
    comment.text = req.param('text');
    comment.from_user = { uid: req.param('from_user') };
    comment.reply_to = { comment_id: req.param('reply_to') };
    comment.options = {
      anonymous : Boolean(req.param('anonymous')),
      secret : Boolean(req.param('secret'))
    };
    comment.post_time = Date();
    db.collection('comments').insert(comment, function (err, result) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        res.status(201).send(result[0]);
      }
    });
  });

  // GET a channel use it's name
  router.get('/channels/:id', function(req, res) {
    db.collection('channels').findOne({channel_id: req.param('id')}, function(err, result) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        res.send(result);
      }
    });
  });
}

module.exports = tree_hole;
