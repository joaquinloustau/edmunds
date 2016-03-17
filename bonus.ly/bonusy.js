var bonuses = [];
  var bonuses_buffer_size = 30;
  var current_bonus = 0;
  var delay = 1000
  
  $(document).ready(function() {
    if('false' == 'false') {
      // setInterval(function() { display_bonus(); advance_bonus(); }, 10*delay);
    }
    // setInterval(function() { load_bonuses(bonuses_buffer_size) }, 5*60*delay);
    load_bonuses(bonuses_buffer_size);
    if('false'== 'true') {
      $("#advance").css('display', 'block');
    }
  });
  
  function advance_bonus() {
    current_bonus++;
  }
  
  function display_bonus() {
    if(current_bonus > (bonuses.length - 1)) {
      current_bonus = 0;
    }
    if(bonuses.length > 0) {
      update_dashboard_with_bonus(bonuses[current_bonus]);
    }
  }
  
  function shuffle(o){
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
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
  
  function update_dashboard_with_bonus(bonus) {
    $(".fadeable").fadeOut(delay, function() {
      if (bonus.receivers[0].short_name.length > 8) {
        $('.to').toggleClass('small', true);
      } else {
        $('.to').toggleClass('small', false);
      }

      if (bonus.giver.short_name.length > 8) {
        $('.from.name').toggleClass('small', true);
      } else {
        $('.from.name').toggleClass('small', false);
      }
  
      $('.profile').attr("src", bonus.receivers[0].full_pic_url); //#TODO: This will need a new UI to accomodate more receivers
      $('.profile.giver').attr("src", bonus.giver.full_pic_url); //#TODO: This will need a new UI to accomodate more 
      $('.from').text(bonus.giver.short_name);               
      $('.profile').one('load', function() {
        $('.to').text(bonus.receivers[0].short_name); 
        $('.reason-text').html(jQuery.truncate(bonus.reason_html, { length: 140, words: true }));
        $('.reason-from').text(' - ' + bonus.giver.short_name);
        $('.time-ago').text(timeSince(new Date(bonus.created_at)) + ' ago via bonus.ly');
        if('false' == 'true') {
          $('.amount').text(bonus.amount_with_currency);
        }
      }).each(function() {
        if(this.complete) $(this).load();
      });
      $(".fadeable").fadeIn(delay);
    });
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
      display_bonus();
      advance_bonus();
    });
  }
  
  $(function(){
    $('#advance').click(function(e) {
      display_bonus();
      advance_bonus();
    });
  });
</script>
<script>
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