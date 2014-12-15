/**
 * Created by hqythu on 12/16/2014.
 */

'use strict';

module.exports = function (req, res, next) {
  if(req.session.user) {
    next();
  } else {
    res.redirect('/account/login');
  }
};
