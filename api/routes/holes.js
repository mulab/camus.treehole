'use strict';
var express = require('express');
var mongodb = require('mongodb');
var db = require('../config/db').db();
var _ = require('lodash');
var async = require('async');
var error = require('../../common/helper/error');
var router = express.Router();

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
  async.waterfall([
    // retrieve channel
    function (callback) {
      db.collection('channels').findOne({ channel_id: hole.options.channel_id }, function (err, channel) {
        callback(err, channel);
      });
    },

    // insert feedback
    function (channel, callback) {
      var feedbacks;
      if (!req.param('feedbacks') || req.param('feedbacks').length === 0) {
        feedbacks = _.forEach(_.clone(channel.options.default_feedbacks, true), function (elem) {
          elem.count = 0;
        });
      } else {
        feedbacks = _.map(req.param('feedbacks'), function (elem) {
          return { type: 'vote', text: elem, count: 0 };
        });
      }
      db.collection('feedbacks').insert(feedbacks, function (err, feedbacks) {
        if (err) {
          return callback(err);
        }
        hole.feedbacks = _.map(feedbacks, function (elem) {
          return { feedback_id: elem._id };
        });
        callback(null, hole);
      });
    },

    // insert hole
    function (hole, callback) {
      db.collection('holes').insert(hole, function (err, hole) {
        if (err) {
          callback(err);
        } else {
          callback(null, hole[0]);
        }
      });
    }

  ], function (err, result) {
    if (err) {
      return next(err);
    } else {
      res.status(201).send(result);
    }
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
  if (endId && !mongodb.ObjectID.isValid(endId)) {
    return next(error('invalid end id', { status: 400 }));
  }
  var query = {
    _id: { $lt: new mongodb.ObjectID(endId) }
  };
  async.waterfall([
    function (callback) {
      db.collection('holes').find(query, options).toArray(function (err, holes) {
        callback(err, holes);
      });
    },
    function (holes, callback) {
      async.each(
        holes,
        function (hole, callback_role) {
          var query = {
            user: hole.author,
            hole: { hole_id: hole._id }
          };
          db.collection('roles').findOne(query, function (err, role) {
            delete hole.author;
            hole.user_role = role;
            callback_role(null);
          });
        },
        function(err) {
          callback(err, holes);
        }
      );
    }
  ], function (err, holes) {
    if(err) {
      next(err);
    } else {
      res.send(holes);
    }
  });
});

// GET /treehole/:id get agit  tree-hole
router.get('/:id', function (req, res, next) {
  if (!mongodb.ObjectID.isValid(req.param('id'))) {
    return next(error('invalid hole id', { status: 404 }));
  }
  async.waterfall([
    // retrieve hole
    function (callback) {
      db.collection('holes').findOne({ _id: new mongodb.ObjectID(req.param('id')) }, function (err, hole) {
        if (err) {
          return callback(err);
        }
        if (!hole) {
          return callback(error('invalid hole id', { status: 404 }));
        }
        callback(null, hole);
      });
    },

    function (hole, callback) {
      var query = {
        user: hole.author,
        hole: { hole_id: hole._id }
      };
      db.collection('roles').findOne(query, function (err, role) {
        delete hole.author;
        hole.user_role = role;
        callback_role(null);
      });
    },

    // retrieve feedback
    function (hole, callback) {
      var feedbacksQuery = _.map(hole.feedbacks, function (elem) {
        return { _id: elem.feedback_id };
      });
      db.collection('feedbacks').find({ $or: feedbacksQuery }).toArray(function (err, feedbacks) {
        if (err) {
          return callback(err);
        }
        hole.feedbacks = feedbacks;
        callback(null, hole);
      });
    }

  ], function (err, result) {
    if (err) {
      next(err);
    }
    res.send(result);
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
  if (endId && !mongodb.ObjectID.isValid(endId)) {
    return next(error('invalid end id', { status: 400 }));
  }
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
  if (!mongodb.ObjectID.isValid(req.param('feedback_id'))) {
    return next(error('invalid feedback id', { status: 404 }));
  }
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


module.exports = router;
