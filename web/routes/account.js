/**
 * Created by hqythu on 12/16/2014.
 */

'use strict';

var express = require('express');
var router = express.Router();
var async = require('async');
var restRequest = require('../helper/rest-request');
var auth = require('../helper/auth').auth;
var checkTicket = require('../helper/auth').checkTicket;

router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
  var username = req.param('username');
  var password = req.param('password');
  //var user_ip = req.headers['x-forwarded-for'] ||
  //  req.connection.remoteAddress ||
  //  req.socket.remoteAddress ||
  //  req.connection.socket.remoteAddress;
  auth(username, password, req.ip, function (err, ticket) {
    if (err) {
      if (err.message === 'Authentication failed') {
        res.send({status: 'fail'});
      } else {
        next(err);
      }
    } else {
      checkTicket(ticket, req.ip, function (err, userInfo) {
        restRequest.use('treehole').get('/users/' + userInfo.yhm, next)
          .success(function (user) {
            if (user) {
              req.session.user = user.user_id;
              res.send({status: 'success'});
            } else {
              restRequest.use('treehole').post('/users',
                {
                  user_id: userInfo.yhm,
                  screen_name: userInfo.xm,
                  tsinghua_account: {
                    student_number: userInfo.zjh,
                    student_id: userInfo.yhm,
                    real_name: userInfo.xm
                  }
                }, next)
                .success(function (user) {
                  req.session.user = user.user_id;
                  res.send({status: 'success'});
                });
            }
          });
      });
    }
  })
});

router.get('/logout', function (req, res) {
  delete req.session.user;
  res.redirect('/');
});

module.exports = router;
