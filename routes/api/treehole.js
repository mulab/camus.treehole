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
  router.post('/holes', function (req, res, next) {
    var hole = {};
    hole.author = { uid: req.param('author') };
    hole.options = {
      channel_id: req.param('channel'),
      anonymous: req.param('anonymous')
    };
    hole.text = req.param('text');
    hole.image = req.param('images');
    hole.references = req.param('references');
    hole.publish_time = Date();
    db.collection('channels').findOne({channel_id: hole.options.channel_id}, function (err, channel) {
      if(err) {
        return next(err);
      }
      var feedbacks = [];
      if(!req.param('feedbacks')) {
        feedbacks = channel.options.default_feedbacks;
        for(var i = 0; i < feedbacks.length; i++) {
          feedbacks[i].count = 0;
        }
      }
      else {
        for(var i = 0; i < req.param('feedbacks').length; i++) {
          feedbacks.push({
            type: 'vote',
            text: req.param('feedbacks')[i],
            count: 0
          });
        }
      }
      db.collection('feedbacks').insert(feedbacks, function (err, feedbacks) {
        if(err) {
          return next(err);
        }
        hole.feedbacks = [];
        for(var i = 0; i < feedbacks.length; i++) {
          hole.feedbacks.push({feedback_id: feedbacks[i]._id});
        }
        db.collection('holes').insert(hole, function (err, hole) {
          if (err) {
            return next(err);
          }
          res.status(201).send(hole[0]);
        });
      });
    });
  });

  //GET /treehole: get tree-holes
  router.get('/holes', function (req, res, next) {
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
        return next(err);
      }
      res.send(docs);
    });
  });

  // GET /treehole/:id get agit  tree-hole
  router.get('/holes/:id', function (req, res, next) {
    db.collection('holes').findOne({_id: new mongodb.ObjectID(req.param('id'))}, function (err, hole) {
      if (err) {
        return next(err);
      }
      if (!hole) {
        err = new Error('Not Found');
        err.status = 404;
        return next(err);
      }
      var feedbacks_query = [];
      for(var i = 0; i < hole.feedbacks.length; i++) {
        feedbacks_query.push({_id: hole.feedbacks[i].feedback_id});
      }
      var query = {
        $or: feedbacks_query
      }
      db.collection('feedbacks').find(query).toArray(function (err, feedbacks) {
        if(err) {
          return next(err);
        }
        hole.feedbacks = feedbacks;
        res.send(hole);
      });
    });
  });

  // GET a comment using hole id
  router.get('/holes/:hole_id/comments', function (req, res, next) {
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
        return next(err);
      }
      res.send(docs);
    });
  });

  router.post('/holes/:hole_id/comments', function (req, res, next) {
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
        return next(err);
      }
      res.status(201).send(result[0]);
    });
  });

  router.post('/holes/:hole_id/feedbacks/:feedback_id', function (req, res, next) {
    var options = {};
    if(req.param('action') == 'ok') {
      options = {$inc:{count:1}};
    }
    else {
      options = {$inc:{count:-1}};
    }
    db.collection('feedbacks').findAndModify({_id: new mongodb.ObjectID(req.param('feedback_id'))},
      {}, options, {new:true}, function (err, result) {
      if(err) {
        return next(err);
      }
      res.status(201).send(result.count.toString());
    })
  });

  // GET a channel use it's name
  router.get('/channels/:id', function (req, res, next) {
    db.collection('channels').findOne({channel_id: req.param('id')}, function (err, result) {
      if (err) {
        return next(err);
      }
      if (!result) {
        err = new Error('Not Found');
        err.status = 404;
        return next(err);
      }
      res.send(result);
    });
  });
}

module.exports = tree_hole;
