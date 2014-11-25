'use strict';
$(function() {
  var refreshCornerProperty = function() {
    $('.hole-container .first-block').removeClass('first-block');
    $('.hole-container .last-block').removeClass('last-block');
    $('.hole-container .block:visible:first').addClass('first-block');
    $('.hole-container .block:visible:last').addClass('last-block');
  };

  refreshCornerProperty();

  var postCommentBlock = $('.hole-container .post-comment');
  var normalBtnGroup = $('.hole-container .main-part .right-part > .normal');
  var postCommentBtnGroup = $('.hole-container .main-part .right-part > .for-comment');

  $('#post-comment-btn').click(function() {
    normalBtnGroup.hide();
    postCommentBtnGroup.show();
    postCommentBlock.show();
    refreshCornerProperty();
    postCommentBlock.find('.reply-input').focus();
  });

  $('#cancel-comment-btn').click(function() {
    normalBtnGroup.show();
    postCommentBtnGroup.hide();
    postCommentBlock.hide();
    refreshCornerProperty();
  });

  $('#submit-comment-btn').click(function() {
    postCommentBlock.find('form').submit();
  });

  $('.feedback-button').click(function() {
    var postUrl = '/hole/' + $('.hole-container').attr('hole-id') + '/feedbacks/' + $(this).attr('feedback-id');
    $.post(postUrl, { action: 'ok' }, $.proxy(function (data) {
      $(this).find('.badge').html(data);
    }, this));
  });
});
