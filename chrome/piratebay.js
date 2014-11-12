var page = $('<div />');
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
  var ele = $(e.currentTarget).find('a.detLink');
  var target = ele.attr('href');
  var x = ele.offset().left;
  var reference = ele.offset().top - $(document).scrollTop();
  var y = ele.offset().top;
  var name, match;

  page.load(target, function() {
    match = page[0].innerHTML.match(/imdb\.com\/title\/(.*?)[\/\"]/i);

    if(match !== null && match.length && match[1] != '') {
      $('#sextantSpinner').show();
      $('#sextantContent').hide();
      $("#sextant").fadeIn(300);

      // sextant height plus padding and arrow
      var sextantHeight = $("#sextant").height() + 25 + 40;

      x = x - 100;

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

      $.getJSON('http://www.omdbapi.com/?tomatoes=true&i=' + encodeURIComponent(match[1]), function(response) {
        getTrailer(response.Title, match[1]);
        $('#sextantTitle').text(response.Title);
        $('#sextantRelease').text(response.Released);
        $('#sextantDescription').text(response.Plot);
        if(response.imdbRating != 'N/A') {
          $('#sextantImdbRating').text(response.imdbRating + '/10 (' + response.imdbVotes + ' reviews)');
        } else {
          $('#sextantImdbRating').text('N/A');
        }
        $('#sextantLength').text(response.Runtime);
        $('#sextantDirector').text(response.Director);
        if(response.tomatoMeter != 'N/A') {
          $('#sextantRottenTomatoesCritics').text(response.tomatoMeter + '% (' + response.tomatoReviews + ' reviews)');
        } else {
          $('#sextantRottenTomatoesCritics').text('N/A');
        }
        if(response.tomatoUserMeter != 'N/A') {
          $('#sextantRottenTomatoesAudience').text(response.tomatoUserMeter + '% (' + response.tomatoUserReviews + ' reviews)');
        } else {
          $('#sextantRottenTomatoesAudience').text('N/A');
        }

        $('#sextantContent').show();
      });
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

var getTrailer = function(name, imdb_id) {
  $.getJSON('http://trailersapi.com/trailers.json?movie=' + encodeURIComponent(name) + '&limit=10&width=444', function (response) {
    var match = null;
    if(response.length > 0) {
      $.each(response, function (i, clip) {
        if(clip.title.toUpperCase().indexOf(name.toUpperCase()) !== -1) {
          match = clip;
          return false
        }
      });

      if(match !== null) {
        $('#sextantMedia').html(match.code);
        $('#sextantSpinner').hide();
      } else {
        getPoster(name, imdb_id);
      }
    } else {
      getPoster(name, imdb_id);
    }
  });
};

var getPoster = function (name, imdb_id) {
  $('#sextantMedia').html('<img height="250" src="http://img.omdbapi.com/?apikey=4883a6a1&h=250&i=' + encodeURIComponent(imdb_id) + '" />');
  $('#sextantSpinner').hide();
};

$(".detLink").parents('td').hoverIntent({
  over: showSextant, // function = onMouseOver callback (REQUIRED)
  timeout: 300, // number = milliseconds delay before onMouseOut
  out: hideSextant // function = onMouseOut callback (REQUIRED)
});

function setup() {
  $('.detLink').removeAttr('title');
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
          '<a href="#" class="sextantClose" style=" border-bottom: none;display:block;float:right;right:0;margin-top:-12px;margin-right:-12px;width:15px;height:15px;margin-bottom:10px;background:transparent url(' + chrome.extension.getURL('img/arrows.png') +') no-repeat right top;"></a>' +
          '<div id="sextantMedia" style="min-width:444px;height:250px;"></div>' +
        '</div>' +
      '</div>' +
      '<div class="sextant-arrow" style="width:45px;height:30px;background:transparent url(' + chrome.extension.getURL('img/arrows.png') +') no-repeat left top;bottom:-25px;position:absolute;left:20%;margin-left:-30px;"></div>' +
      '<div style="position:absolute;top:115px;left:345px;" id="sextantSpinner"><img src="' + chrome.extension.getURL('img/spinner.gif') + '" /></div>' +
    '</div>'));
}

setup();