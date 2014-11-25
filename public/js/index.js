'use strict';
$(function() {
  var wall = new freewall(".hole-container");
  wall.reset({ selector: '.hole-wrapper', cellW: 'auto', cellH: 'auto', gutterX: 20, gutterY: 20 });
  wall.fitWidth();

  $('form').keydown(function (e){
    if (e.keyCode === 13) {
      e.preventDefault();
      return false;
    }
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
  feedbackList.find('.add-term input').keyup(function (e){
    if (e.keyCode === 13) {
      var content = $.trim($(this).val());
      if (content.length > 0) {
        var newTerm = feedbackList.find('.term-template').clone();
        newTerm.removeClass('term-template');
        newTerm.find('.content').html(content);
        newTerm.appendTo(feedbackList.find('.term-container'));
        initFeedbackTerm(newTerm);
        if (feedbackList.find('.term-container > .term').length === 3) {
          feedbackList.find('.add-term').hide();
        }
      }
      $(this).val('');
      e.preventDefault();
      return false;
    }
  });
  feedbackList.find('.term-container > .term').each(function () {
    initFeedbackTerm($(this));
  });

  var holeContainer = $('.hole-container');
  holeContainer.find('.hole').each(function() {
    $(this).hover(function() {
      $(this).addClass('hover-state');
    }, function() {
      $(this).removeClass('hover-state');
    });
    $(this).click(function() {
      window.location.href = $(this).data('href');
    });
  });
});
