/**
 * Created by guangchen on 10/26/14.
 */
'use strict';
var mongodb = require('mongodb');
var db = require('../../config/db').db();
/**
 *
 * @param router
 */
function tree_hole(router) {
  //POST /treehole: create tree-hole
  router.post('/holes', function (req, res) {
    db.collection('holes').insert({'title': req.body.title}, function (err, result) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        res.status(201).send(result[0]);
      }
    });
  });

  //GET /treehole: get tree-holes
  router.get('/holes', function (req, res) {
    db.collection('holes').find().toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        res.send(docs);
      }
    });
  });

  // GET /treehole/:id get agit  tree-hole
  router.get('/holes/:id', function (req, res) {
    db.collection('holes').findOne({_id: new mongodb.ObjectID(req.param('id'))}, function(err, result) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        console.log(result);
        res.send(result);
      }
    });
  });
}

module.exports = tree_hole;
