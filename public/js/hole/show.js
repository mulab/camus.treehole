'use strict';
$(function() {
  var refresh_corner_property = function() {
    var all_blocks = $('.hole-container .block');
    all_blocks.css('border-top-left-radius', '');
    all_blocks.css('border-top-right-radius', '');
    all_blocks.css('border-bottom-left-radius', '');
    all_blocks.css('border-bottom-right-radius', '');

    var first_block = $('.hole-container .block:visible:first');
    var last_block = $('.hole-container .block:visible:last');
    first_block.css('border-top-left-radius', '5px');
    first_block.css('border-top-right-radius', '5px');
    last_block.css('border-bottom-left-radius', '5px');
    last_block.css('border-bottom-right-radius', '5px');
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
  //$('#submit-comment-btn').click(function() {
  //  post_comment_block.find('form').submit();
  //});
});
