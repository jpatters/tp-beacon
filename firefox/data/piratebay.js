var linkTarget
  , regex
  , xAdjust
  , xhr1 = null
  , xhr2 = null
  , isTPB
  , urls = self.options.urls
  , KAT = false
  , TPB = false
  , toCompare
  , doubleView;


for(var i = 0; i < urls.length; i++) {
  toCompare = urls[i].substring(2, urls[i].length);
  if(window.location.href.indexOf(toCompare) !== -1) {
    if(i < 3) {
      KAT = true;
    } else {
      TPB = true;
    }
    break;
  }
}

if(KAT) {
  linkTarget = $('a.cellMainLink');
  regex = /imdb\.com\\\/title\\\/(.*?)[\\\/\"]/i;
  xAdjust = 200;
  isTPB = false;
} else {
  if($('a.detLink').length > 0) {
    doubleView = true;
    linkTarget = $('a.detLink');
  } else {
    doubleView = false;
    linkTarget = $('table#searchResult tbody tr td:nth-child(2) a');
  }

  regex = /imdb\.com\/title\/(.*?)[\/\"]/i;
  xAdjust = 0;
  isTPB = true;
}
/*!
 * hoverIntent v1.8.1 // 2014.08.11 // jQuery v1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2014 Brian Cherne
 */

/* hoverIntent is similar to jQuery's built-in "hover" method except that
 * instead of firing the handlerIn function immediately, hoverIntent checks
 * to see if the user's mouse has slowed down (beneath the sensitivity
 * threshold) before firing the event. The handlerOut function is only
 * called after a matching handlerIn.
 *
 * // basic usage ... just like .hover()
 * .hoverIntent( handlerIn, handlerOut )
 * .hoverIntent( handlerInOut )
 *
 * // basic usage ... with event delegation!
 * .hoverIntent( handlerIn, handlerOut, selector )
 * .hoverIntent( handlerInOut, selector )
 *
 * // using a basic configuration object
 * .hoverIntent( config )
 *
 * @param  handlerIn   function OR configuration object
 * @param  handlerOut  function OR selector for delegation OR undefined
 * @param  selector    selector OR undefined
 * @author Brian Cherne <brian(at)cherne(dot)net>
 */
(function($) {
    $.fn.hoverIntent = function(handlerIn,handlerOut,selector) {

        // default configuration values
        var cfg = {
            interval: 100,
            sensitivity: 6,
            timeout: 0
        };

        if ( typeof handlerIn === "object" ) {
            cfg = $.extend(cfg, handlerIn );
        } else if ($.isFunction(handlerOut)) {
            cfg = $.extend(cfg, { over: handlerIn, out: handlerOut, selector: selector } );
        } else {
            cfg = $.extend(cfg, { over: handlerIn, out: handlerIn, selector: handlerOut } );
        }

        // instantiate variables
        // cX, cY = current X and Y position of mouse, updated by mousemove event
        // pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
        var cX, cY, pX, pY;

        // A private function for getting mouse position
        var track = function(ev) {
            cX = ev.pageX;
            cY = ev.pageY;
        };

        // A private function for comparing current and previous mouse position
        var compare = function(ev,ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            // compare mouse positions to see if they've crossed the threshold
            if ( Math.sqrt( (pX-cX)*(pX-cX) + (pY-cY)*(pY-cY) ) < cfg.sensitivity ) {
                $(ob).off("mousemove.hoverIntent",track);
                // set hoverIntent state to true (so mouseOut can be called)
                ob.hoverIntent_s = true;
                return cfg.over.apply(ob,[ev]);
            } else {
                // set previous coordinates for next time
                pX = cX; pY = cY;
                // use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
                ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
            }
        };

        // A private function for delaying the mouseOut function
        var delay = function(ev,ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            ob.hoverIntent_s = false;
            return cfg.out.apply(ob,[ev]);
        };

        // A private function for handling mouse 'hovering'
        var handleHover = function(e) {
            // copy objects to be passed into t (required for event object to be passed in IE)
            var ev = $.extend({},e);
            var ob = this;

            // cancel hoverIntent timer if it exists
            if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

            // if e.type === "mouseenter"
            if (e.type === "mouseenter") {
                // set "previous" X and Y position based on initial entry point
                pX = ev.pageX; pY = ev.pageY;
                // update "current" X and Y position based on mousemove
                $(ob).on("mousemove.hoverIntent",track);
                // start polling interval (self-calling timeout) to compare mouse coordinates over time
                if (!ob.hoverIntent_s) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

                // else e.type == "mouseleave"
            } else {
                // unbind expensive mousemove event
                $(ob).off("mousemove.hoverIntent",track);
                // if hoverIntent state is true, then call the mouseOut function after the specified delay
                if (ob.hoverIntent_s) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
            }
        };

        // listen for mouseenter and mouseleave
        return this.on({'mouseenter.hoverIntent':handleHover,'mouseleave.hoverIntent':handleHover}, cfg.selector);
    };
})(jQuery);

$("a.sextantClose").hover(function(){
  $(this).css("background-position", "right -15px");
},
function(){
  $(this).css("background-position", "right top");
});

$(".sextantClose").click(function () {
  $('#sextant').fadeOut(500);
  return false;
});

var showSextant = function(e) {
  var ele, target, x, reference, y, name, match;

  if(TPB && doubleView) {
    ele = $(e.currentTarget).find('a.detLink');
  } else if(TPB) {
    ele = $(e.currentTarget).find('td:nth-child(2) a');
  } else if(KAT) {
    ele = $(e.currentTarget).find('a.cellMainLink');
  }

  target = ele.attr('href');
  x = ele.offset().left;
  reference = ele.offset().top - $(document).scrollTop();
  y = ele.offset().top;

  if(xhr1 !== null) {
    xhr1.abort();
  }

  if(xhr2 !== null) {
    xhr2.abort();
  }

  xhr1 = $.ajax({
    url: target,
    dataType: 'html',
    success: function(page) {
      if(isTPB) {
        match = page.match(regex);
      } else {
        match = page.match(regex);
      }

      if(match !== null && match.length && match[1] != '') {
        $('#sextantSpinner').show();
        $('#sextantContent').hide();
        $("#sextant").fadeIn(300);

        // sextant height plus padding and arrow
        var sextantHeight = $("#sextant").height() + 25 + 40;

        x = x - 100 + xAdjust;

        if (sextantHeight > reference) {
          y = y + 40;
          $("#sextant").css("left", x).css("top", y);
          $(".sextant-arrow").css({
            "background-position": "-60px top",
            "top": "-27px"
          });
        } else {
          y = y - sextantHeight;
          $("#sextant").css("left", x).css("top", y);
          $(".sextant-arrow").css({
            "background-position": "left top",
            "top": "auto",
            "bottom": "-25px"
          });
        }

        xhr2 = $.getJSON('https://api.jpatterson.me/beacon/movie/' + encodeURIComponent(match[1]), function(response) {
          response = response.movie;
          $('#sextantTitle').text(response.title);
          $('#sextantRelease').text(response.released);
          $('#sextantDescription').text(response.plot);
          if(response.imdbRating != 'N/A') {
            $('#sextantImdbRating').text(response.imdb_rating + '/10 (' + response.imdb_votes + ' reviews)');
          } else {
            $('#sextantImdbRating').text('N/A');
          }
          $('#sextantLength').text(response.runtime);
          $('#sextantDirector').text(response.director);
          if(response.tomato_meter != 'N/A') {
            $('#sextantRottenTomatoesCritics').text(response.tomato_meter + '% (' + response.tomato_reviews + ' reviews)');
          } else {
            $('#sextantRottenTomatoesCritics').text('N/A');
          }
          if(response.tomato_user_meter != 'N/A') {
            $('#sextantRottenTomatoesAudience').text(response.tomato_user_meter + '% (' + response.tomato_user_reviews + ' reviews)');
          } else {
            $('#sextantRottenTomatoesAudience').text('N/A');
          }

          if(response.trailer !== null) {
            youtube = response.trailer.match(/src=\"(.*?)\"/i);
            width = response.trailer.match(/width=\"(.*?)\"/i);
            height = response.trailer.match(/height=\"(.*?)\"/i);
            iframe = $('<iframe />').attr('height', height[1]).attr('width', width[1]).attr('frameborder', '0').attr('allowfullscreen', true).attr('src', youtube[1]);
            $('#sextantMedia').append(iframe);
          } else {
            img = $('<img />').attr('height', '250').attr('src', 'https://api.jpatterson.me/beacon/movie/poster/' + encodeURIComponent(response.id))
            $('#sextantMedia').append(img);
          }

          $('#sextantContent').show();
          $('#sextantSpinner').hide();
        });
      }
    }
  });
};

var hideSextant = function() {
  var isHovered = $('#sextant:hover').length;
  if (!isHovered) {
    $('#sextant').fadeOut(300, function() {
      $('#sextantMedia').empty()
    });
  } else {
    $('#sextant').hover(
    function(){

    },
    function(){
      $('#sextant').fadeOut(300, function() {
        $('#sextantMedia').empty()
      });
    });
  }
};

linkTarget.parents('tr').hoverIntent({
  over: showSextant, // function = onMouseOver callback (REQUIRED)
  timeout: 300, // number = milliseconds delay before onMouseOut
  out: hideSextant // function = onMouseOut callback (REQUIRED)
});

function setup() {
  linkTarget.removeAttr('title');
  $('body').append($('<div id="sextant" style="display: none;position:absolute;min-height:260px;padding:20px;background:white;border:1px solid #eee;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;-webkit-box-shadow:0 0 10px rgba(0,0,0,0.69);-moz-box-shadow:0 0 10px rgba(0,0,0,0.69);box-shadow:0 0 10px rgba(0,0,0,0.69);z-index:100;left:50px;min-width:715px;">' +
      '<div id="sextantContent" style="display:none;">' +
        '<div style="float: left;max-width: 250px;margin-right: 20px; text-align: left;">' +
          '<h3 id="sextantTitle" style="text-transform: uppercase;margin-bottom: 0;margin-top: 0;"></h3>' +
          '<p id="sextantRelease" style="font-size: 80%;color: #888;"></p>' +
          '<p id="sextantDescription"></p>' +
          '<hr style="color: #eee;background-color: #eee;height: 2px;border: none;" />' +
          '<p><strong>IMDb Rating:</strong> <span id="sextantImdbRating"></span></p>' +
          '<p><strong>RT Critics:</strong> <span id="sextantRottenTomatoesCritics"></span></p>' +
          '<p><strong>RT Audience:</strong> <span id="sextantRottenTomatoesAudience"></span></p>' +
          '<hr style="color: #eee;background-color: #eee;height: 2px;border: none;" />' +
          '<p><strong>Director:</strong> <span id="sextantDirector"></span></p>' +
          '<p><strong>Length:</strong> <span id="sextantLength"></span></p>' +
        '</div>' +
        '<div style="float: left;min-width: 445px;">' +
          '<a href="#" class="sextantClose" style="border-bottom:none;display:none;float:right;right:0;margin-top:-12px;margin-right:-12px;width:15px;height:15px;margin-bottom:10px;background:transparent url(' + self.options.arrowImg +') no-repeat right top;"></a>' +
          '<div id="sextantMedia" style="min-width:444px;height:250px;text-align:center;"></div>' +
        '</div>' +
      '</div>' +
      '<div class="sextant-arrow" style="width:45px;height:30px;background:transparent url(' + self.options.arrowImg +') no-repeat left top;bottom:-25px;position:absolute;left:20%;margin-left:-30px;"></div>' +
      '<div style="position:absolute;top:115px;left:345px;" id="sextantSpinner"><img src="' + self.options.spinnerImg + '" /></div>' +
    '</div>'));
}

setup();