/**
 * Created by hqythu on 12/15/2014.
 */
'use strict';

var express = require('express');
var router = express.Router();
var db = require('../config/db').db();
var error = require('../../common/helper/error');
var crypto = require('crypto');

// create a new user
router.post('/', function (req, res, next) {
  var user = {};
  user.user_id = req.param('user_id');
  user.screen_name = req.param('screen_name');
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
      res.status(201).send(user[0]);
    }
  });
});

// retrieve an existing user
router.get('/:user_id', function (req, res, next) {
  db.collection('users').findOne({ user_id: req.param('user_id') }, function (err, user) {
    if(err) {
      next(err);
    } else {
      if(user) {
        res.send(user);
      } else {
        res.send(null);
      }
    }
  });
});

router.post('/authenticate', function (req, res, next) {
  db.collection('auth').findOne({ username: req.param('username') }, function (err, user) {
    if(err) {
      next(err);
    } else {
      var md5 = crypto.createHash('md5');
      md5.update(req.param('password'));
      var pass_md5 = md5.digest('hex');
      console.log(pass_md5);
      if(pass_md5 === user.password) {
        res.status(200).end();
      } else {
        res.status(403).end();
      }
    }
  });
});

module.exports = router;
