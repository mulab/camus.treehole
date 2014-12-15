/**
 * Created by guangchen on 11/1/14.
 */
'use strict';

var mongodb = require('mongodb');

module.exports = function (db) {
  db.collection('holes', {strict: true}, function (err) {
    if (err) {
      var holes = [
        {
          _id : new mongodb.ObjectID("547429245659ef9816649219"),
          "publish_time": "Sun Nov 09 13:41:00 +0800 2014",
          "text": "Hello Treehole! :smile:",
          "images": [],
          "author_id": "xiao_wang",
          "feedbacks": [
            {
              "type": "vote",
              "text": "like",
              "count": 10
            },
            {
              "type": "vote",
              "text": "dislike",
              "count": 5
            }
          ],
          "references": [ ],
          "options": {
            "anonymous": true,
            "channel_id": "testChannel"
          }
        }
      ];
      db.collection('holes', function (err, collection) {
        collection.insert(holes, {safe: true}, function (err, result) {
          console.log(result);
        });
      });
    }
  });
  db.collection('comments', {strict: true}, function (err) {
    if (err) {
      var comments = [
        {
            "hole_id" : new mongodb.ObjectID("547429245659ef9816649219"),
            "post_time" : "Sun Nov 09 17:56:55 +0800 2014",
            "text" : "This is test comment 2",
            "from_user" : "xiao_zhang",
            "reply_to" : new mongodb.ObjectID("545e28a80000000000000000"),
            "options" : {
              "anonymous" : true,
              "secret" : false
          }
        },
        {
          "hole_id" : new mongodb.ObjectID("547429245659ef9816649219"),
          "post_time" : "Sun Nov 09 17:56:55 +0800 2014",
          "text" : "This is a simple comment",
          "from_user" : "xiao_wang",
          "reply_to" : new mongodb.ObjectID("545e28a80000000000000000"),
          "options" : {
            "anonymous" : true,
            "secret" : false
          }
        }
      ];
      db.collection('comments', function (err, collection) {
        collection.insert(comments, {safe: true}, function (err, result) {
          console.log(result);
        });
      });
    }
  });
  db.collection('channels', {strict: true}, function (err) {
    if (err) {
      var channels = [
        {
          "channel_id": "testChannel",
          "screen_name": "Test Channel",
          "description": "This is a channel for debugging!",
          "sub_channels": [33, 35, 39],
          "options": {
            "default_pulish_anonymous": true,
            "default_comment_anonymous": false,
            "default_feedbacks": [
              {"type": "vote", "text": ":+1:"},
              {"type": "vote", "text": ":-1:"}
            ]
          }
        }
      ];
      db.collection('channels', function (err, collection) {
        collection.insert(channels, {safe: true}, function (err, result) {
          console.log(result);
        });
      });
    }
  });
  db.collection('roles', {strict: true}, function (err) {
    if (err) {
      var roles = [
        {
          "user": "xiao_wang",
          "hole": new mongodb.ObjectID("547429245659ef9816649219"),
          "avatar": null,
          "text": "楼主"
        },
        {
          "user": "xiao_zhang",
          "hole": new mongodb.ObjectID("547429245659ef9816649219"),
          "avatar": null,
          "text": "沙发"
        }
      ];
      db.collection('roles', function (err, collection) {
        collection.insert(roles, {safe: true}, function (err, result) {
          console.log(result);
        });
      });
    }
  });
};
