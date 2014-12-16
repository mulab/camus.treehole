/**
 * Created by hqythu on 12/16/2014.
 */

'use strict';

var appid = 'ALL_ZHJW';

var request = require('request');
var error = require('../../common/helper/error');

function auth(username, password, user_ip, callback) {
  var post_url = 'https://id.tsinghua.edu.cn/thuser/authapi/login/'
    + appid + '/' + user_ip.replace(/./g, '_');
  request.post(post_url, {form: {username: username, password: password}},
    function (err, response, body) {
      if (response.statusCode === 200) {
        var result = JSON.parse(body);
        if (result.status === 'RESTLOGIN_OK') {
          callback(null, result.ticket);
        } else {
          callback(error('Authentication failed', {status: 403}))
        }
      } else {
        callback(error('request failed'), {status: 500});
      }
    });
}

function checkTicket(ticket, user_ip, callback) {
  var post_url = 'https://id.tsinghua.edu.cn/thuser/authapi/checkticket/'
    + appid + '/' + ticket + '/' + user_ip.replace(/./g, '_');
  request.get(post_url, function (err, response, body) {
    if(response.statusCode === 200) {
      var result = {};
      var a = body.split(':');
      for(var i = 0; i < a.length; i++) {
        var tmp = a[i].split('=');
        result[tmp[0]] = tmp[1];
      }
      if(result.code === '0') {
        callback(null, result);
      } else {
        callback(error('Authentication failed', {status: 403}))
      }
    } else {
      callback(error('request failed'), {status: 500});
    }
  });
}

module.exports.auth = auth;
module.exports.checkTicket = checkTicket;
