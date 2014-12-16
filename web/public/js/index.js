'use strict';
$(function () {
  var wall = new freewall(".hole-container");
  wall.reset({ selector: '.hole-wrapper', cellW: 'auto', cellH: 'auto', gutterX: 20, gutterY: 20 });
  wall.fitWidth();

  var postHoleForm = $('#post-hole-form');
  var postHoleOptions = $('.post-hole .options');
  $('.post-hole .submit-button button').click(function () {
    if (postHoleForm.find('textarea').val().length === 0) {
      alert('内容不能为空！');
      return;
    }
    postHoleForm.find('input[name=feedbacks]').remove();
    feedbackList.find('.term-container .term .content').each(function () {
      $('<input type="hidden" name="feedbacks" />').val($(this).html()).appendTo(postHoleForm);
    });
    var imageFiles = postHoleOptions.find('.image-upload input:file').prop('files');
    async.map(imageFiles, function (image, callback) {
      async.waterfall([
        function (callback) {
          $.post('/image', function (data) {
            callback(null, data);
          }).fail(function (jqXHR, textStatus) {
            callback(textStatus);
          });
        },

        function (res, callback) {
          var url = res.request.url;
          var imageId = res.id;
          var params = res.request.params;
          var fd = new FormData();
          fd.append('policy', params.policy);
          fd.append('signature', params.signature);
          fd.append('file', image);
          $.ajax({
            url: url,
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (data) {
              data = JSON.parse(data);
              var body = data.code + '&' + data.message + '&' + data.url + '&' + data.time;
              callback(null, imageId, body, data.sign);
            },
            error: function (jqXHR, textStatus) {
              callback(textStatus);
            }
          });
        },

        function (imageId, body, sign, callback) {
          $.post('/image/' + imageId + '/ready', { body: body, sign: sign }, function () {
            callback(null, imageId);
          }).fail(function (jqXHR, textStatus) {
            callback(textStatus);
          });
        }

      ], callback);
    }, function (err, imageIds) {
      if (err) {
        alert(err);
        return;
      }
      postHoleForm.find('input[name=images]').remove();
      $.each(imageIds, function (index, imageId) {
        $('<input type="hidden" name="images" />').val(imageId).appendTo(postHoleForm);
      });
      postHoleForm.submit();
    });
  });

  postHoleOptions.find('.anonymous input:checkbox').change(function () {
    postHoleForm.find('input[name=anonymous]').prop('checked', $(this).prop('checked'));
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
