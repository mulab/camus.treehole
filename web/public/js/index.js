'use strict';
$(function () {
  var wall = new freewall(".hole-container");
  wall.reset({ selector: '.hole-wrapper', cellW: 'auto', cellH: 'auto', gutterX: 20, gutterY: 20 });
  wall.fitWidth();

  var postHoleForm = $('#post-hole-form');
  postHoleForm.submit(function () {
    if ($(this).find('textarea').val().length === 0) {
      alert('内容不能为空！');
      return false;
    }
    $(this).find('input[name=feedbacks]').remove();
    feedbackList.find('.term-container .term .content').each(function () {
      $('<input type="hidden" name="feedbacks" />').val($(this).html()).appendTo(postHoleForm);
    });
  });
  $('.post-hole .submit-button button').click(function () {
    postHoleForm.submit();
  });

  var feedbackList = $('.post-hole .feedback-list');
  var initFeedbackTerm = function (term) {
    term.find('.delete-button').click(function () {
      $(this).parent().remove();
      if (feedbackList.find('.term-container > .term').length < 3) {
        feedbackList.find('.add-term').show();
      }
    });
  };
  feedbackList.find('.add-term form').submit(function (){
    var content = $.trim($(this).find('input').val());
    if (content.length > 0) {
      var newTerm = feedbackList.find('.term-template').clone();
      newTerm.removeClass('term-template');
      newTerm.find('.content').html(content);
      newTerm.appendTo(feedbackList.find('.term-container'));
      newTerm.show();
      initFeedbackTerm(newTerm);
      if (feedbackList.find('.term-container > .term').length === 3) {
        feedbackList.find('.add-term').hide();
      }
    }
    $(this).find('input').val('');
  });
  feedbackList.find('.term-container > .term').each(function () {
    initFeedbackTerm($(this));
  });

  var holeContainer = $('.hole-container');
  holeContainer.find('.hole').each(function () {
    $(this).hover(function () {
      $(this).addClass('hover-state');
    }, function () {
      $(this).removeClass('hover-state');
    });
    $(this).click(function () {
      window.open($(this).data('href'));
    });
  });
});
