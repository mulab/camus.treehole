/**
 * Created by hqythu on 12/16/2014.
 */

'use strict';

var express = require('express');
var router = express.Router();
var restRequest = require('../helper/rest-request');

router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
  var param = {
    username: req.param('username'),
    password: req.param('password')
  };
  restRequest.use('treehole').post('/users/authenticate', param, next)
    .success(function () {
      req.session.user = req.param('username');
      res.redirect('/');
    })
    .fail(function () {
      res.render('login');
    });
});

router.get('/logout', function (req, res) {
  delete req.session.user;
  res.redirect('/');
});

module.exports = router;
