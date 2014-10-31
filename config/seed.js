/**
 * Created by guangchen on 11/1/14.
 */
'use strict';

module.exports = function(db) {
  db.collection('holes', {strict: true}, function (err, collection) {
    if (err) {
      var holes = [
        {
          "title": "Jogging in park"
        },
        {
          "title": "Pick-up posters from post-office"
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
