'use strict';
$(function() {
  var refresh_corner_property = function() {
    $('.hole-container .first-block').removeClass('first-block');
    $('.hole-container .last-block').removeClass('last-block');
    $('.hole-container .block:visible:first').addClass('first-block');
    $('.hole-container .block:visible:last').addClass('last-block');
  };

  refresh_corner_property();

  var post_comment_block = $('.hole-container .post-comment');
  var normal_btn_group = $('.hole-container .main-part .right-part > .normal');
  var post_comment_btn_group = $('.hole-container .main-part .right-part > .for-comment');
  $('#post-comment-btn').click(function() {
    normal_btn_group.hide();
    post_comment_btn_group.show();
    post_comment_block.show();
    refresh_corner_property();
  });
  $('#cancel-comment-btn').click(function() {
    normal_btn_group.show();
    post_comment_btn_group.hide();
    post_comment_block.hide();
    refresh_corner_property();
  });
  $('#submit-comment-btn').click(function() {
    post_comment_block.find('form').submit();
  });
});
