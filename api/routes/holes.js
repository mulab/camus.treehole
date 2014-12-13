'use strict';
var mongodb = require('mongodb');
var db = require('../../config/db').db();
var _ = require('lodash');


module.exports = function (router) {
  //POST /treehole: create tree-hole
  router.post('/', function (req, res, next) {
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
    db.collection('channels').findOne({ channel_id: hole.options.channel_id }, function (err, channel) {
      if (err) {
        return next(err);
      }
      var feedbacks;
      if (!req.param('feedbacks') || req.param('feedbacks').length === 0) {
        feedbacks = _.forEach(_.clone(channel.options.default_feedbacks, true), function (elem) {
          elem.count = 0;
        });
      } else {
        feedbacks = _.map(req.param('feedbacks'), function (elem) {
          return {
            type: 'vote',
            text: elem,
            count: 0
          };
        });
      }
      db.collection('feedbacks').insert(feedbacks, function (err, feedbacks) {
        if (err) {
          return next(err);
        }
        hole.feedbacks = _.map(feedbacks, function (elem) {
          return { feedback_id: elem._id };
        });
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
  router.get('/', function (req, res, next) {
    var count = req.param('count', 10);
    var page = req.param('page', 1);
    var endId = req.param('end_id');
    var options = {
      skip: (page - 1) * count,
      limit: count,
      sort: { "_id": -1 }
    };
    var query = {
      _id: { $lt: new mongodb.ObjectID(endId) }
    };
    db.collection('holes').find(query, options).toArray(function (err, docs) {
      if (err) {
        return next(err);
      }
      res.send(docs);
    });
  });

  // GET /treehole/:id get agit  tree-hole
  router.get('/:id', function (req, res, next) {
    db.collection('holes').findOne({ _id: new mongodb.ObjectID(req.param('id')) }, function (err, hole) {
      if (err) {
        return next(err);
      }
      if (!hole) {
        err = new Error('Not Found');
        err.status = 404;
        return next(err);
      }
      var feedbacksQuery = _.map(hole.feedbacks, function (elem) {
        return { _id: elem.feedback_id };
      });
      var query = {
        $or: feedbacksQuery
      };
      db.collection('feedbacks').find(query).toArray(function (err, feedbacks) {
        if (err) {
          return next(err);
        }
        hole.feedbacks = feedbacks;
        res.send(hole);
      });
    });
  });

  // GET a comment using hole id
  router.get('/:hole_id/comments', function (req, res, next) {
    var count = req.param('count', 10);
    var page = req.param('page', 1);
    var endId = req.param('end_id');
    var options = {
      skip: (page - 1) * count,
      limit: count,
      sort: { "_id": 1 }
    };
    var query = {
      hole_id: req.param('hole_id'),
      _id: { $lt: new mongodb.ObjectID(endId) }
    };
    db.collection('comments').find(query, options).toArray(function (err, docs) {
      if (err) {
        return next(err);
      }
      res.send(docs);
    });
  });

  router.post('/:hole_id/comments', function (req, res, next) {
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

  router.post('/:hole_id/feedbacks/:feedback_id', function (req, res, next) {
    var options = {};
    if (req.param('action') === 'ok') {
      options = { $inc: { count: 1 } };
    }
    else {
      options = { $inc: { count: -1 } };
    }
    db.collection('feedbacks').findAndModify({ _id: new mongodb.ObjectID(req.param('feedback_id')) },
      {}, options, { new: true }, function (err, result) {
        if (err) {
          return next(err);
        }
        res.status(201).send(result.count.toString());
      });
  });

  // GET a channel use it's name
  router.get('/channels/:id', function (req, res, next) {
    db.collection('channels').findOne({ channel_id: req.param('id') }, function (err, result) {
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
};
