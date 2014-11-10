var page = $('<div />');
/*!
 * hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license.
 * Copyright 2007, 2013 Brian Cherne
 */
(function(e){e.fn.hoverIntent=function(t,n,r){var i={interval:100,sensitivity:7,timeout:0};if(typeof t==="object"){i=e.extend(i,t)}else if(e.isFunction(n)){i=e.extend(i,{over:t,out:n,selector:r})}else{i=e.extend(i,{over:t,out:t,selector:n})}var s,o,u,a;var f=function(e){s=e.pageX;o=e.pageY};var l=function(t,n){n.hoverIntent_t=clearTimeout(n.hoverIntent_t);if(Math.abs(u-s)+Math.abs(a-o)<i.sensitivity){e(n).off("mousemove.hoverIntent",f);n.hoverIntent_s=1;return i.over.apply(n,[t])}else{u=s;a=o;n.hoverIntent_t=setTimeout(function(){l(t,n)},i.interval)}};var c=function(e,t){t.hoverIntent_t=clearTimeout(t.hoverIntent_t);t.hoverIntent_s=0;return i.out.apply(t,[e])};var h=function(t){var n=jQuery.extend({},t);var r=this;if(r.hoverIntent_t){r.hoverIntent_t=clearTimeout(r.hoverIntent_t)}if(t.type=="mouseenter"){u=n.pageX;a=n.pageY;e(r).on("mousemove.hoverIntent",f);if(r.hoverIntent_s!=1){r.hoverIntent_t=setTimeout(function(){l(n,r)},i.interval)}}else{e(r).off("mousemove.hoverIntent",f);if(r.hoverIntent_s==1){r.hoverIntent_t=setTimeout(function(){c(n,r)},i.timeout)}}};return this.on({"mouseenter.hoverIntent":h,"mouseleave.hoverIntent":h},i.selector)}})(jQuery)

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
  var name;

  page.load(target, function() {
    match = page[0].innerHTML.match(/imdb\.com\/title\/(.*?)\/\"/i);
    if(match !== null && match.length) {
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

      $.getJSON('http://www.imdbapi.com/?tomatoes=true&i=' + encodeURIComponent(match[1]), function(response) {
        getTrailer(response.Title, match[1]);
        $('#sextantTitle').text(response.Title);
        $('#sextantRelease').text(response.Released);
        $('#sextantDescription').text(response.Plot);
        $('#sextantRating').text(response.imdbRating + '/10');
        $('#sextantRatingCount').text(response.imdbVotes);
        $('#sextantRottenTomatoes').text();
        $('#sextantLength').text(response.Runtime);
        $('#sextantDirector').text(response.Director);

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
  $('body').append($('<div id="sextant" style="display: none;position:absolute;min-height:260px;padding:20px;background:white;border:1px solid #eee;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;-webkit-box-shadow:0 0 10px rgba(0,0,0,0.69);-moz-box-shadow:0 0 10px rgba(0,0,0,0.69);box-shadow:0 0 10px rgba(0,0,0,0.69);z-index:100;left:50px;width:715px;">' +
      '<div id="sextantContent" style="display:none;">' +
        '<div style="float: left;max-width: 250px;margin-right: 20px; text-align: left;">' +
          '<h3 id="sextantTitle" style="text-transform: uppercase;margin-bottom: 0;margin-top: 0;"></h3>' +
          '<p id="sextantRelease" style="font-size: 80%;color: #888;"></p>' +
          '<p id="sextantDescription"></p>' +
          '<hr style="color: #eee;background-color: #eee;height: 2px;border: none;" />' +
          '<p><strong>IMDb Rating:</strong> <span id="sextantRating"></span> <span class="sextant-meta-text">from <span id="sextantRatingCount"></span> users</span></p>' +
          // '<p><strong>Rotten Tomatoes:</strong> <span id="sextantRottenTomatoes"></span></p>' +
          '<hr style="color: #eee;background-color: #eee;height: 2px;border: none;" />' +
          '<p><strong>Director:</strong> <span id="sextantDirector"></span></p>' +
          '<p><strong>Length:</strong> <span id="sextantLength"></span></p>' +
        '</div>' +
        '<div style="float: left;width: 445px;">' +
          '<a href="#" class="sextantClose" style=" border-bottom: none;display:block;float:right;right:0;margin-top:-12px;margin-right:-12px;width:15px;height:15px;margin-bottom:10px;background:transparent url(' + chrome.extension.getURL('img/arrows.png') +') no-repeat right top;"></a>' +
          '<div id="sextantMedia" style="width:444px;height:250px;"></div>' +
        '</div>' +
      '</div>' +
      '<div class="sextant-arrow" style="width:45px;height:30px;background:transparent url(' + chrome.extension.getURL('img/arrows.png') +') no-repeat left top;bottom:-25px;position:absolute;left:20%;margin-left:-30px;"></div>' +
      '<div style="position:absolute;top:115px;left:345px;" id="sextantSpinner"><img src="' + chrome.extension.getURL('img/spinner.gif') + '" /></div>' +
    '</div>'));
}

setup();