/**
 * Created by guangchen on 10/28/14.
 */
'use strict';
var mongo = require('mongodb');


module.exports = function(config, callback) {
  var server = new mongo.Server(config.db_host, config.db_port, config.db_option);
  var client = new mongo.MongoClient(server);

  client.open(function (err, client) {
    callback(err, client);
  });
};
