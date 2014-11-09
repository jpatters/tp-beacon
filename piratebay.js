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
  var target = $(e.currentTarget).attr('href');
  var x = $(this).offset().left;
  var y = $(this).offset().top;
  var page = $('<div />');

  page.load(target, function() {
    match = page[0].innerHTML.match(/imdb\.com\/(.*?)\"/i)
    if(match !== null && match.length) {
      $("#sextant").fadeIn(300);

      // sextant height plus padding and arrow
      var sextantHeight = $("#sextant").height() + 25 + 40;

      x = x - 100;

      if (sextantHeight > y ) {
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
      page.load('http://www.imdb.com/' + match[1], function() {
        page = page[0].innerHTML;

        $('#sextantTitle').text(findAttribute(page, 'name'));
        $('#sextantRelease').text(findAttribute(page, 'release'));
        $('#sextantDescription').text(findAttribute(page, 'description'));
        $('#sextantRating').text(findAttribute(page, 'rating') + '/10');
        $('#sextantRatingCount').text(findAttribute(page, 'ratingCount'));
        $('#sextantLength').text(findAttribute(page, 'length'));
      });
    }
  });
};

var hideSextant = function() {
  var isHovered = $('#sextant:hover').length;
  if (!isHovered) {
    $('#sextant').fadeOut(300);
  } else {
    $('#sextant').hover(
    function(){

    },
    function(){
      $('#sextant').fadeOut(300);
    });
  }
};

var findAttribute = function(page, attribute) {
  var regex, match;
  switch(attribute) {
    case 'name':
      regex = /itemprop=\"name\".*?>(.*?)</;
      break;
    case 'length':
      regex = /itemprop=\"duration\".*?>(.*?)</;
      break
    case 'release':
      regex = /itemprop=\"datePublished\".*?content=\"(.*?)\"/;
      break;
    case 'genre':
      regex = /itemprop=\"genre\".*?>(.*?)</;
      break;
    case 'description':
      regex = /itemprop=\"description\".*?>[\s\S](.*?)[\s\S]</;
      break;
    case 'rating':
      regex = /itemprop=\"ratingValue\".*?>(.*?)</;
      break;
    case 'ratingCount':
      regex = /itemprop=\"ratingCount\".*?>(.*?)</;
      break;
  }

  match = page.match(regex);

  if(match !== null) {
    return match[1];
  } else {
    return '';
  }
};

$(".detLink").hoverIntent({
  over: showSextant, // function = onMouseOver callback (REQUIRED)
  timeout: 300, // number = milliseconds delay before onMouseOut
  out: hideSextant // function = onMouseOut callback (REQUIRED)
});

function setup() {
  $('body').append($('<div id="sextant" style="display: none;position:absolute;min-height:250px;padding:20px;background:white;border:1px solid #eee;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;-webkit-box-shadow:0 0 10px rgba(0,0,0,0.69);-moz-box-shadow:0 0 10px rgba(0,0,0,0.69);box-shadow:0 0 10px rgba(0,0,0,0.69);z-index:100;left:50px;">' +
      '<div style="float: left;max-width: 250px;margin-right: 20px; text-align: left;">' +
        '<h3 id="sextantTitle" style="text-transform: uppercase;margin-bottom: 0;margin-top: 0;">Ted</h3>' +
        '<p id="sextantRelease" style="font-size: 80%;color: #888;">December 2012</p>' +
        '<p id="sextantDescription">As the result of a childhood wish, John Bennett\'s teddy bear, Ted, came to life and has been by John\'s side ever since - a friendship that\'s tested when Lori, John\'s girlfriend of four years, wants more from their relationship.</p>' +
        '<hr style="color: #eee;background-color: #eee;height: 2px;border: none;" />' +
        '<p><strong>IMDb Rating:</strong> <span id="sextantRating">7.1/10</span> <span class="sextant-meta-text">from <span id="sextantRatingCount">218,349</span> users</span></p>' +
        '<hr style="color: #eee;background-color: #eee;height: 2px;border: none;" />' +
        '<p><strong>Director:</strong> Quinton Teritino</p>' +
        '<p><strong>Length:</strong> <span id="sextantLength">165 minutes</span></p>' +
      '</div>' +
      '<div style="float: left;width: 445px;">' +
        '<a href="#" class="sextantClose" style=" border-bottom: none;display:block;float:right;right:0;margin-top:-12px;margin-right:-12px;width:15px;height:15px;margin-bottom:10px;background:transparent url(' + chrome.extension.getURL('img/arrows.png') +') no-repeat right top;"></a>' +
        '<iframe width="444" height="250" src="http://www.youtube-nocookie.com/embed/9fbo_pQvU7M?rel=0" frameborder="0" allowfullscreen></iframe>' +
        '<a href="http://hackcah.com" class="builtby" style="float: right;color: #444; border-bottom: none;">Built by hackcah.com</a>' +
      '</div>' +
      '<div class="sextant-arrow" style="width:45px;height:30px;background:transparent url(' + chrome.extension.getURL('img/arrows.png') +') no-repeat left top;bottom:-25px;position:absolute;left:20%;margin-left:-30px;"></div>' +
    '</div>'));
}

setup();