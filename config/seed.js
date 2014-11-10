/**
 * Created by guangchen on 11/1/14.
 */
'use strict';

module.exports = function(db) {
  db.collection('holes', {strict: true}, function (err, collection) {
    if (err) {
      var holes = [
        {
          "publish_time" : "Sun Nov 09 13:41:00 +0800 2014",
          "text" : "Hello Treehole! :smile:",
          "images" : [],
          "author" : {
            "uid" : "xiao_wang"
          },
          "feedbacks" : [],
          "references" : [],
          "options" : {
            "anonymous" : true,
            "channel_id" : "testChannel"
          }
        },
        {
          "publish_time" : "Sun Nov 09 13:41:00 +0800 2014",
          "text" : "Test hole 2",
          "images" : [],
          "author" : {
            "uid" : "xiao_wang"
          },
          "feedbacks" : [],
          "references" : [],
          "options" : {
            "anonymous" : true,
            "channel_id" : "testChannel"
          }
        },
        {
          "publish_time" : "Sun Nov 09 13:41:00 +0800 2014",
          "text" : "Test hole 3",
          "images" : [],
          "author" : {
            "uid" : "xiao_wang"
          },
          "feedbacks" : [],
          "references" : [],
          "options" : {
            "anonymous" : true,
            "channel_id" : "testChannel"
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
  db.collection('comments', {strict: true}, function (err, collection) {
    if(err) {
      var comments = [
        {
          "hole_id" : "5460580a5c93dddeaf7668b2",
          "post_time" : "Sun Nov 09 17:56:55 +0800 2014",
          "text" : "This is test comment 2",
          "from_user" : {
            "uid" : "xiao_zhang"
          },
          "reply_to" : {
            "comment_id" : "545e28a80000000000000000"
          },
          "options" : {
            "anonymous" : true,
            "secret" : false
          }
        },
        {
          "hole_id" : "5460580a5c93dddeaf7668b2",
          "post_time" : "Sun Nov 09 17:56:55 +0800 2014",
          "text" : "This is a simple comment",
          "from_user" : {
            "uid" : "xiao_wang"
          },
          "reply_to" : {
            "comment_id" : "545e28a80000000000000000"
          },
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
};
