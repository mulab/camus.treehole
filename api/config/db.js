/**
 * Created by guangchen on 10/28/14.
 */
'use strict';

var mongo = require('mongodb');
var nconf = require('nconf');
var server = new mongo.Server(nconf.get('db:host'), nconf.get('db:port'), nconf.get('db:option'));
var client = new mongo.MongoClient(server);
var NOT_CONNECTED = 0,
    CONNECTING = 1,
    CONNECTED = 2,
    FAILED = 3;
var status = NOT_CONNECTED;
var pending_call_backs = [];

exports.connect = function (callback) {
  if (status === NOT_CONNECTED || status === FAILED) {
    status = CONNECTING;
    client.open(function (err, client) {
      console.log("connect to mongodb://%s:%s/", nconf.get('db:host'), nconf.get('db:port'));
      console.log("options: %s", nconf.get('db:option'));
      if (nconf.get('seed')) {
        require('./seed')(exports.db());
      }
      for (var i = 0; i < pending_call_backs.length; i++) {
        pending_call_backs[i](err, client);
      }
      callback(err, client);
    });
  } else if (status === CONNECTING) {
    pending_call_backs.push(callback);
  } else if (status === CONNECTED) {
    callback(null, client);
  }

};

exports.db = function () {
  return client.db(nconf.get('db:name'));
};
