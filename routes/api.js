/**
 * Created by guangchen on 10/26/14.
 */
'use strict';

var express = require('express');
var router = express.Router();

router.get('/status', function(req, res) {
  req.db.collection('holes', {strict: true}, function(err, collection) {
    if(err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

require('./api/treehole')(router);

module.exports = router;
