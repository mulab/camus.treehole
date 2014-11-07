/**
 * Created by guangchen on 11/1/14.
 */
'use strict';

module.exports = function(db) {
  db.collection('holes', {strict: true}, function (err, collection) {
    if (err) {
      var holes = [
        {
          "user": "user1",
          "channel": "blackhole",
          "text": "Jogging in park",
          "images": ["2", "3", "4"],
          "feedback_counters": [4, 1, 2],
          "count_comments": 5,
          "count_repost": 3
        },
        {
          "user": "user2",
          "channel": "blackhole",
          "text": "Pick-up posters from post-office",
          "images": ["1", "5", "7"],
          "feedback_counters": [4, 1, 2],
          "count_comments": 5,
          "count_repost": 3
        }
      ];
      db.collection('holes', function (err, collection) {
        collection.insert(holes, {safe: true}, function (err, result) {
          console.log(result);
        });
      });
    }
  });
};
