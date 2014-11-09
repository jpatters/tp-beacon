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
  var target = $(e.currentTarget).attr('href');
  var x = $(this).offset().left;
  var y = $(this).offset().top;

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
        page = $(page[0].innerHTML);

        $('#sextantTitle').text(findAttribute('name'));
        $('#sextantRelease').text(findAttribute('release'));
        $('#sextantDescription').text(findAttribute('description'));
        $('#sextantRating').text(findAttribute('rating'));
        $('#sextantRatingCount').text(findAttribute('ratingCount'));
        $('#sextantLength').text(findAttribute('length'));
        $('#sextantDirector').text(findAttribute('director'));

        $('#sextantSpinner').hide();
        $('#sextantContent').show();
        page = $('<div />');
      });
    }
  });
};

var hideSextant = function() {
  var isHovered = $('#sextant:hover').length;
  if (!isHovered) {
    $('#sextant').fadeOut(300, function() {
      $('#sextantContent').hide();
      $('#sextantSpinner').show();
    });
  } else {
    $('#sextant').hover(
    function(){

    },
    function(){
      $('#sextant').fadeOut(300, function() {
        $('#sextantContent').hide();
        $('#sextantSpinner').show();
      });
    });
  }
};

var findAttribute = function(attribute) {
  var ele, match;
  switch(attribute) {
    case 'name':
      ele = page.find('h1.header span[itemprop="name"]');
      if(ele.length > 0) {
        return ele.text();
      }
      break;
    case 'length':
      ele = page.find('div.infobar time[itemprop="duration"]');
      if(ele.length > 0) {
        return ele.text();
      }
      break
    case 'release':
      ele = page.find('meta[itemprop="datePublished"]');
      if(ele.length > 0) {
        return ele.attr('content');
      }
      break;
    case 'genre':
      ele = page.find('span[itemprop="genre"]');
      if(ele.length > 0) {
        tmp = Array();
        ele.each(function(i, e) {
          tmp.push(e.text());
        });

        return tmp.join('|');
      }
      break;
    case 'description':
      ele = page.find('p[itemprop="description"]');
      if(ele.length > 0) {
        return ele.text();
      }
      break;
    case 'rating':
      ele = page.find('span[itemprop="ratingValue"]');
      if(ele.length > 0) {
        return ele.text() + '/10';
      }
      break;
    case 'ratingCount':
      ele = page.find('span[itemprop="ratingCount"]');
      if(ele.length > 0) {
        return ele.text();
      }
      break;
    case 'director':
      ele = page.find('div[itemprop="director"] span[itemprop="name"]');
      if(ele.length > 0) {
        return ele.text();
      }
      break;
    // case 'media':
    //   regex = //;
    //   break;
  }

  return '';
};

$(".detLink").hoverIntent({
  over: showSextant, // function = onMouseOver callback (REQUIRED)
  timeout: 300, // number = milliseconds delay before onMouseOut
  out: hideSextant // function = onMouseOut callback (REQUIRED)
});

function setup() {
  $('body').append($('<div id="sextant" style="display: none;position:absolute;min-height:250px;padding:20px;background:white;border:1px solid #eee;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;-webkit-box-shadow:0 0 10px rgba(0,0,0,0.69);-moz-box-shadow:0 0 10px rgba(0,0,0,0.69);box-shadow:0 0 10px rgba(0,0,0,0.69);z-index:100;left:50px;width:715px;">' +
      '<div id="sextantContent" style="display:none;">' +
        '<div style="float: left;max-width: 250px;margin-right: 20px; text-align: left;">' +
          '<h3 id="sextantTitle" style="text-transform: uppercase;margin-bottom: 0;margin-top: 0;"></h3>' +
          '<p id="sextantRelease" style="font-size: 80%;color: #888;"></p>' +
          '<p id="sextantDescription"></p>' +
          '<hr style="color: #eee;background-color: #eee;height: 2px;border: none;" />' +
          '<p><strong>IMDb Rating:</strong> <span id="sextantRating"></span> <span class="sextant-meta-text">from <span id="sextantRatingCount"></span> users</span></p>' +
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
      '<div style="margin-top:90px;" id="sextantSpinner"><img src="' + chrome.extension.getURL('img/spinner.gif') + '" /></div>' +
    '</div>'));
}

setup();