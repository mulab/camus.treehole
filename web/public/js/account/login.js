/**
 * Created by hqythu on 12/16/2014.
 */

'use strict';

$(function () {
  $('#form').submit(function () {
    var data = {
      username: $('#username').val(),
      password: $('#password').val()
    };
    $.post('/account/login', data, function (response) {
      if(response.status === 'success') {
        window.location.href = '/';
      } else {
        alert('验证失败');
      }
    }, 'json');
    return false;
  });
});
