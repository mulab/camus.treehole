/**
 * Created by guangchen on 10/28/14.
 */
'use strict';
var env = process.env.NODE_ENV || 'development';
var mongo = require('mongodb');
var config = require('./environments/' + env);
var server = new mongo.Server(config.db_host, config.db_port, config.db_option);
var client = new mongo.MongoClient(server);
var NOT_CONNECTED = 0,
    CONNECTING = 1,
    CONNECTED = 2,
    FAILED = 3;
var status = NOT_CONNECTED;
var pending_call_backs = [];

exports.connect = function(callback) {
  if (status === NOT_CONNECTED || status === FAILED) {
    status = CONNECTING;
    client.open(function(err, client) {
      console.log("connect to mongodb://%s:%s/", config.db_host, config.db_port);
      console.log("options: %s", config.db_option);
      if (config.seed) {
        require('./seed')(exports.db());
      }
      for (var i = 0; i < pending_call_backs.length; i++) {
        pending_call_backs[i](err, client);
      }
      callback(err, client);
    });
  } else if (status === CONNECTING) {
    pending_call_backs.push(callback);
  }
  else if (status === CONNECTED) {
    callback(null, client);
  }

};

exports.db = function() {
  return client.db(config.db_name);
};
