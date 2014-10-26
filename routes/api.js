/**
 * Created by guangchen on 10/26/14.
 */
'use strict';

var express = require('express');
var router = express.Router();

router.get('/status', function(req, res) {
  res.sendStatus(200);
});

require('./api/treehole')(router);

module.exports = router;
