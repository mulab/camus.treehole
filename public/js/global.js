'use strict';
$(function() {
  var time_formatter = function(time_string) {
    moment.locale('zh-cn', {
      calendar: {
        lastDay: '昨天 H:m',
        sameDay: '今天 H:m',
        nextDay: '明天 H:m',
        lastWeek: '本ddd H:m',
        nextWeek: '下ddd H:m',
        sameElse: 'YYYY年M月D日 H:m'
      },
      relativeTime: {
        future: '%s之后',
        past:   '%s以前',
        s:  '几秒',
        m:  '一分钟',
        mm: '%d分钟',
        h:  '一小时',
        hh: '%d小时',
        d:  '一天',
        dd: '%d天',
        M:  '一个月',
        MM: '%d月',
        y:  '一年',
        yy: '%d年'
      }
    });

    var time = moment(time_string);
    if (moment().diff(time, 'hours', true) <= 1) {
      return time.fromNow();
    } else {
      return time.calendar();
    }

  };

  $('span.time-need-format').each(function() {
    var result = time_formatter($(this).html());
    $(this).html(result);
    $(this).removeClass('time-need-format');
  });
});