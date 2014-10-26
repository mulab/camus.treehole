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
  router.post('/treehole', function(req, res) {
    res.status(500).send({error: 'not implement yet'});
  });

  //GET /treehole: get tree-holes
  router.get('/treehole', function(req, res) {
    res.status(500).send({error: 'not implement yet'});
  });

  // GET /treehole/:id get a tree-hole
  router.get('/treehole/:id', function(req, res) {
    res.status(500).send({error: 'not implement yet'});
  });
}

module.exports = tree_hole;
