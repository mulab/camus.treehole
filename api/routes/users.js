/**
 * Created by hqythu on 12/15/2014.
 */
'use strict';

var express = require('express');
var router = express.Router();
var db = require('../config/db').db();
var error = require('../../common/helper/error');

// create a new user
router.post('/', function (req, res, next) {
  var user = {};
  user.user_id = req.param('user_id');
  user.screen_name = req.param('sceen_name');
  user.join_time = Date();
  user.contact_info = null;
  user.links = null;
  user.wechat_account = null;
  user.renren_account = null;
  user.weibo_account = null;
  user.tsinghua_account = req.param('tsinghua_account');
  db.collection('users').insert(user, function (err, user) {
    if(err) {
      next(err);
    } else {
      res.status(201).send(user);
    }
  });
});

// retrieve an existing user
router.get('/:user_id', function (req, res, next) {
  db.collection('users').findOne({ user_id: req.param('user_id') }, function (err, user) {
    if(err) {
      next(err);
    } else {
      res.send(user);
    }
  });
});

module.exports = router;
