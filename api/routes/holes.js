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
  hole.author_id = req.param('author');
  hole.options = {
    channel_id: req.param('channel'),
    anonymous: Boolean(req.param('anonymous'))
  };
  hole.text = req.param('text');
  hole.image = req.param('images');
  hole.references = req.param('references');
  hole.publish_time = Date();
  async.waterfall([
    // retrieve channel
    function (callback) {
      db.collection('channels').findOne({channel_id: hole.options.channel_id}, function (err, channel) {
        callback(err, channel);
      });
    },

    // insert hole
    function (channel, callback) {
      var feedbacks;
      if (!req.param('feedbacks') || req.param('feedbacks').length === 0) {
        feedbacks = _.forEach(_.clone(channel.options.default_feedbacks, true), function (elem) {
          elem.count = 0;
        });
      } else {
        feedbacks = _.map(req.param('feedbacks'), function (elem) {
          return {type: 'vote', text: elem, count: 0};
        });
      }
      hole.feedbacks = feedbacks;
      db.collection('holes').insert(hole, function (err, hole) {
        callback(err, hole[0]);
      });
    },

    // create user role
    function (hole, callback) {
      var role = {
        user: hole.author_id,
        hole: hole._id,
        avatar: null,
        text: "匿名用户"
      };
      if (hole.options.anonymous) {
        db.collection('roles').insert(role, function (err, role) {
          delete hole.author_id;
          hole.user_role = role[0];
          delete hole.user_role._id;
          delete hole.user_role.user;
          delete hole.user_role.hole;
          callback(err, hole);
        });
      } else {
        db.collection('users').findOne({user_id: hole.author_id}, function (err, user) {
          delete hole.author_id;
          hole.user_role = user;
          callback(err, hole);
        });
      }
    }

  ], function (err, hole) {
    if (err) {
      return next(err);
    } else {
      res.status(201).send(hole);
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
    sort: {"_id": -1}
  };
  if (endId && !mongodb.ObjectID.isValid(endId)) {
    return next(error('invalid end id', {status: 400}));
  }
  var query = {
    _id: {$lt: new mongodb.ObjectID(endId)}
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
        function (hole, callback) {
          var query = {
            user: hole.author_id,
            hole: hole._id
          };
          if (hole.options.anonymous) {
            db.collection('roles').findOne(query, function (err, role) {
              delete hole.author_id;
              hole.user_role = role;
              delete hole.user_role._id;
              delete hole.user_role.user;
              delete hole.user_role.hole;
              callback(err);
            });
          } else {
            db.collection('users').findOne({user_id: hole.author_id}, function (err, user) {
              delete hole.author_id;
              hole.user_role = user;
              callback(err);
            });
          }
        },
        function (err) {
          callback(err, holes);
        }
      );
    }
  ], function (err, holes) {
    if (err) {
      next(err);
    } else {
      res.send(holes);
    }
  });
});

// GET /treehole/:id get agit  tree-hole
router.get('/:id', function (req, res, next) {
  if (!mongodb.ObjectID.isValid(req.param('id'))) {
    return next(error('invalid hole id', {status: 404}));
  }
  async.waterfall([
    // retrieve hole
    function (callback) {
      db.collection('holes').findOne({_id: new mongodb.ObjectID(req.param('id'))}, function (err, hole) {
        if (err) {
          return callback(err);
        }
        if (!hole) {
          return callback(error('invalid hole id', {status: 404}));
        }
        callback(err, hole);
      });
    },

    // retrieve role
    function (hole, callback) {
      var query = {
        user: hole.author_id,
        hole: hole._id
      };
      if (hole.options.anonymous) {
        db.collection('roles').findOne(query, function (err, role) {
          delete hole.author_id;
          hole.user_role = role;
          delete hole.user_role._id;
          delete hole.user_role.user;
          delete hole.user_role.hole;
          callback(err, hole);
        });
      } else {
        db.collection('users').findOne({user_id: hole.author_id}, function (err, user) {
          delete hole.author_id;
          hole.user_role = user;
          callback(err, hole);
        });
      }
    }

  ], function (err, hole) {
    if (err) {
      next(err);
    }
    res.send(hole);
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
    sort: {"_id": 1}
  };
  if (endId && !mongodb.ObjectID.isValid(endId)) {
    return next(error('invalid end id', {status: 400}));
  }
  var query = {
    hole_id: new mongodb.ObjectID(req.param('hole_id')),
    _id: {$lt: new mongodb.ObjectID(endId)}
  };
  async.waterfall([
    // retrieve comments
    function (callback) {
      db.collection('comments').find(query, options).toArray(function (err, comments) {
        callback(err, comments);
      });
    },

    // retrieve correspond user role
    function (comments, callback) {
      async.each(
        comments,
        function (comment, callback) {
          var query = {
            user: comment.from_user,
            hole: comment.hole_id
          };
          if (comment.options.anonymous) {
            db.collection('roles').findOne(query, function (err, role) {
              delete comment.from_user;
              comment.user_role = role;
              delete comment.user_role._id;
              delete comment.user_role.user;
              delete comment.user_role.hole;
              callback(err);
            });
          } else {
            db.collection('users').findOne({user_id: comment.from_user}, function (err, user) {
              delete comment.from_user;
              comment.user_role = user;
              callback(err);
            });
          }
        },
        function (err) {
          callback(err, comments);
        }
      );
    }
  ], function (err, comments) {
    if (err) {
      next(err);
    } else {
      res.send(comments);
    }
  });
});

router.post('/:hole_id/comments', function (req, res, next) {
  var comment = {};
  comment.hole_id = new mongodb.ObjectID(req.param('hole_id'));
  comment.text = req.param('text');
  comment.from_user = req.param('from_user');
  comment.reply_to = new mongodb.ObjectID(req.param('reply_to'));
  comment.options = {
    anonymous: Boolean(req.param('anonymous')),
    secret: Boolean(req.param('secret'))
  };
  comment.post_time = Date();
  async.waterfall([
    // insert a comment
    function (callback) {
      db.collection('comments').insert(comment, function (err, comment) {
        callback(err, comment[0]);
      });
    },

    // create corresponding role
    function (comment, callback) {
      if (comment.options.anonymous) {
        db.collection('roles').findOne({
          user: comment.from_user,
          hole: comment.hole_id
        }, function (err, role) {
          if (role) {
            delete comment.from_user;
            comment.user_role = role;
            delete comment.user_role._id;
            delete comment.user_role.user;
            delete comment.user_role.hole;
            callback(err, comment);
          } else {
            var role_insert = {
              user: comment.from_user,
              hole: comment.hole_id,
              avatar: null,
              text: "匿名用户"
            };
            db.collection('roles').insert(role_insert, function (err, role) {
              delete comment.from_user;
              comment.user_role = role[0];
              delete comment.user_role._id;
              delete comment.user_role.user;
              delete comment.user_role.hole;
              callback(err, comment);
            });
          }
        });
      } else {
        db.collection('users').findOne({user_id: comment.from_user}, function (err, user) {
          delete comment.from_user;
          comment.user_role = user;
          callback(err, comment);
        });
      }
    }
  ], function (err, comment) {
    if (err) {
      next(err);
    } else {
      res.status(201).send(comment);
    }
  });
});

router.post('/:hole_id/feedbacks/:feedback_id', function (req, res, next) {
  db.collection('operations').findOne(
    {
      user_id: req.param('user'),
      hole_id: new mongodb.ObjectID(req.param('hole_id'))
    },
    function (err, operation) {
      if (err) {
        next(err);
      } else {
        if (operation) {
          if (operation.feedbacks[req.param('feedback_id')]) {
            res.send({status: 'error', message: 'already voted'});
          } else {
            db.collection('holes').findOne({_id: new mongodb.ObjectID(req.param('hole_id'))}, function (err, hole) {
              hole.feedbacks[req.param('feedback_id')].count++;
              db.collection('holes').findAndModify({_id: new mongodb.ObjectID(req.param('hole_id'))},
                {}, hole, {new: true}, function (err, hole) {
                  res.send({status: 'success', count: hole.feedbacks[req.param('feedback_id')].count});
                });
            });
            operation.feedbacks[req.param('feedback_id')] = true;
            db.collection('operations').findAndModify({_id: new mongodb.ObjectID(operation._id)},
              {}, operation, {new: true}, function (err) {
                if (err) {
                  next(err);
                }
              });
          }
        } else {
          db.collection('holes').findOne({_id: new mongodb.ObjectID(req.param('hole_id'))}, function (err, hole) {
            var operation = {
              user_id: req.param('user'),
              hole_id: new mongodb.ObjectID(req.param('hole_id')),
              feedbacks: new Array(hole.feedbacks.length)
            };
            for (var i = 0; i < operation.feedbacks.length; i++) {
              operation.feedbacks[i] = false;
            }
            operation.feedbacks[req.param('feedback_id')] = true;
            db.collection('operations').insert(operation, function (err) {
              if (err) {
                next(err);
              }
            });
            hole.feedbacks[req.param('feedback_id')].count++;
            db.collection('holes').findAndModify({_id: new mongodb.ObjectID(req.param('hole_id'))},
              {}, hole, {new: true}, function (err, hole) {
                res.send({status: 'success', count: hole.feedbacks[req.param('feedback_id')].count});
              });
          });
        }
      }
    });
});


module.exports = router;
