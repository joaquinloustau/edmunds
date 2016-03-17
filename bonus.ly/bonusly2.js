var bonuses = [];
  var bonuses_buffer_size = 30;
  var current_bonus = 0;
  var delay = 1000
  
  $(document).ready(function() {
    // if('false' == 'false') {
    //   setInterval(function() { display_bonus(); advance_bonus(); }, 10*delay);
    // }
    // var ul = $('ul');
    // ul.append($("<li>").text(bonuses[current_bonus]));
  
    setInterval(function() { load_bonuses(bonuses_buffer_size) }, 5*60*delay);
    load_bonuses(bonuses_buffer_size);
    if('false'== 'true') {
      $("#advance").css('display', 'block');
    }
  });
  
  function advance_bonus() {
    current_bonus++;
  }

  function append_bonus(bonuses) {
    console.log('inside_append');
    var ul = $('ul');
    while (current_bonus < bonuses.length - 1) {
      console.log(bonuses[current_bonus]);
      ul.append($("<li>").text(bonuses[current_bonus].reason_html));
      advance_bonus();
    }
    load_bonuses(bonuses_buffer_size);
  }
  
  function display_bonus() {
    if(current_bonus + 1 == (bonuses.length - 1)) {
      current_bonus = 0;
    }
    if(bonuses.length > 0) {
      update_dashboard_with_bonus(bonuses[current_bonus], bonuses[current_bonus+1]);
    }
  }
  
  function shuffle(o){
      // for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      o.reverse();
      return o;
  };
  
  
  function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
  
    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }
  
  function update_dashboard_with_bonus(bonus1, bonus2) {
    console.log(current_bonus);

      $('#giver-1').attr("src", bonus1.giver.full_pic_url);
      $('#receiver-1').attr("src", bonus1.receivers[0].full_pic_url);
      $('#reason-text-1').html(jQuery.truncate(bonus1.reason_html, { length: 140, words: true }));
        $('#time-ago-1').text(timeSince(new Date(bonus1.created_at)) + ' ago via bonus.ly');
        $('.from-1').text(bonus1.giver.short_name);               
        $('.to-1').text(bonus1.receivers[0].short_name); 

      $('#giver-2').attr("src", bonus2.giver.full_pic_url);
      $('#receiver-2').attr("src", bonus2.receivers[0].full_pic_url);
      $('#reason-text-2').html(jQuery.truncate(bonus2.reason_html, { length: 140, words: true }));
      $('#time-ago-2').text(timeSince(new Date(bonus2.created_at)) + ' ago via bonus.ly');
      $('.from-2').text(bonus2.giver.short_name);               
      $('.to-2').text(bonus2.receivers[0].short_name); 
  }

  
  function load_bonuses(bonuses_buffer_size) {
    // console.log("loading bonuses");
    endpoint = "https://bonus.ly/api/v1/bonuses?limit="+bonuses_buffer_size+"&top_level=true";
    access_token = '3625b98290b8600fefc94919be80947c';
    if(access_token != '') {
      endpoint += "&access_token="+access_token;
    }
    $.getJSON(endpoint, function(data) {
      bonuses = eval(data['result']);
      if('false' == 'false') {
        bonuses = shuffle(bonuses);
      }
      current_bonus = 0;
      append_bonus(bonuses);
      // display_bonus();
      advance_bonus();
    });
  }
  
  $(function(){
    $('#advance').click(function(e) {
      display_bonus();
      advance_bonus();
    });
  });

  (function($) {
  
    // Matches trailing non-space characters.
    var chop = /(\s*\S+|\s)$/;
  
    // Return a truncated html string.  Delegates from $.fn.truncate.
    $.truncate = function(html, options) {
      return $('<div></div>').append(html).truncate(options).html();
    };
  
    // Truncate the contents of an element in place.
    $.fn.truncate = function(options) {
      if ($.isNumeric(options)) options = {length: options};
      var o = $.extend({}, $.truncate.defaults, options);
  
      return this.each(function() {
        var self = $(this);
  
        if (o.noBreaks) self.find('br').replaceWith(' ');
  
        var text = self.text();
        var excess = text.length - o.length;
  
        if (o.stripTags) self.text(text);
  
        // Chop off any partial words if appropriate.
        if (o.words && excess > 0) {
          excess = text.length - text.slice(0, o.length).replace(chop, '').length - 1;
        }
  
        if (excess < 0 || !excess && !o.truncated) return;
  
        // Iterate over each child node in reverse, removing excess text.
        $.each(self.contents().get().reverse(), function(i, el) {
          var $el = $(el);
          var text = $el.text();
          var length = text.length;
  
          // If the text is longer than the excess, remove the node and continue.
          if (length <= excess) {
            o.truncated = true;
            excess -= length;
            $el.remove();
            return;
          }
  
          // Remove the excess text and append the ellipsis.
          if (el.nodeType === 3) {
            $(el.splitText(length - excess - 1)).replaceWith(o.ellipsis);
            return false;
          }
  
          // Recursively truncate child nodes.
          $el.truncate($.extend(o, {length: length - excess}));
          return false;
        });
      });
    };
  
    $.truncate.defaults = {
  
      // Strip all html elements, leaving only plain text.
      stripTags: false,
  
      // Only truncate at word boundaries.
      words: false,
  
      // Replace instances of <br> with a single space.
      noBreaks: false,
  
      // The maximum length of the truncated html.
      length: Infinity,
  
      // The character to use as the ellipsis.  The word joiner (U+2060) can be
      // used to prevent a hanging ellipsis, but displays incorrectly in Chrome
      // on Windows 7.
      // http://code.google.com/p/chromium/issues/detail?id=68323
      ellipsis: '\u2026' // '\u2060\u2026'
  
    };
  
  })(jQuery);