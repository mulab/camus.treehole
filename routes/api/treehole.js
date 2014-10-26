/**
 * Created by guangchen on 10/26/14.
 */
'use strict';

/**
 *
 * @param router
 */
function tree_hole (router) {
  //POST /treehole: create tree-hole
  router.post('/holes', function(req, res) {
    res.status(500).send({error: 'not implement yet'});
  });

  //GET /treehole: get tree-holes
  router.get('/holes', function(req, res) {
    res.status(500).send({error: 'not implement yet'});
  });

  // GET /treehole/:id get agit  tree-hole
  router.get('/holes/:id', function(req, res) {
    res.status(500).send({error: 'not implement yet'});
  });
}

module.exports = tree_hole;
