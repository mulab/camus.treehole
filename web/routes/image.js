'use strict';

var express = require('express');
var router = express.Router();
var restRequest = require('../helper/rest-request');
var treeholeApi = restRequest.use('treehole');
var error = require('../../common/helper/error');
var upyun = require('../helper/upyun');

router.post('/', function (req, res, next) {
  treeholeApi.post('/images', next).success(function (image) {
    var imageId = image._id;
    var requestParams = upyun.generateRequest(imageId);
    res.send({ id: imageId, request: { params: requestParams, url: upyun.getRequestUrl() } });
  });
});

router.post('/:id/ready', function (req, res, next) {
  if (!upyun.validateSign(req.param('body'), req.param('sign'))) {
    res.status(404).send({ message: 'invalid sign' });
    return;
  }
  treeholeApi.post('/images/' + req.param('id') + '/update', { available: true }, next).success(function () {
    res.status(201).send({});
  }).fail(function () {
    res.status(404).send({});
  });
});

module.exports = router;
