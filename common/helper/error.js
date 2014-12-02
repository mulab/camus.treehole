'use strict';

/**
 *
 * @param {String} message Message of the error
 * @param {Number|Object} info Status code or additional information
 * @returns {Error}
 */
module.exports = function (message, info) {
  var err = new Error(message);
  if (typeof info === 'object') {
    for (var key in info) {
      err[key] = info[key];
    }
  }
  if (typeof info === 'number') {
    err.status = info;
  }
  return err;
};
