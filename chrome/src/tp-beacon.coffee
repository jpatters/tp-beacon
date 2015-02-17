class TPBeacon
	linkTarget: null
	regex: null
	xAdjust: null
	urls: chrome.runtime.getManifest().content_scripts[0].matches
	KAT: false
	TPB: false
	EXTRA: false
	doubleView: false
	xhr1: null
	xhr2: null

	constructor: ->
		@init()

		@linkTarget.parents('tr').hoverIntent
			over: @showBeacon
			timeout: 300
			out: @hideBeacon

		$("a.tpBeaconClose").hover ->
			$(this).css("background-position", "right -15px")
		, ->
			$(this).css("background-position", "right top")

		$(".tpBeaconClose").click ->
			$('#tpBeacon').fadeOut(500)
			false

		@build()

	init: =>
		i = 0
		for url in @urls
			toCompare = url.substring(4, url.length - 2)
			if(window.location.href.indexOf(toCompare) != -1)
				if i < 3
					@KAT = true
				else if i == 3
					@EXTRA = true
				else
					@TPB = true
				break

			i++

		if @KAT
			@linkTarget = $('a.cellMainLink')
			@regex = /imdb\.com\\\/title\\\/(.*?)[\<\\\/\"]/i
			@xAdjust = -> 200
		else if @EXTRA
			@linkTarget = $('table.tl tbody tr td:nth-child(2) a:first-child')
			@regex = /imdb\.com\/title\/(.*?)[\<\/\"]/i
			@xAdjust = -> -$(window).width() + 722
		else if @TPB
			if($('a.detLink').length > 0)
				@doubleView = true
				@linkTarget = $('a.detLink')
			else
				@doubleView = false
				@linkTarget = $('table#searchResult tbody tr td:nth-child(2) a')

			@regex = /imdb\.com\/title\/(.*?)[\<\/\"]/i
			@xAdjust = -> 0

	destroy: =>
		$('#tpBeacon').empty().remove();
		@linkTarget.parents('tr').unbind("mouseenter").unbind("mouseleave");
		@linkTarget.parents('tr').removeProp('hoverIntent_t');
		@linkTarget.parents('tr').removeProp('hoverIntent_s');

	hideBeacon: =>
		isHovered = $('#tpBeacon:hover').length
		if (!isHovered)
			console.log 'test'
			if @xhr1?
				@xhr1.abort()

			if @xhr2?
				@xhr2.abort()
			$('#tpBeacon').stop().fadeOut 300, ->
				$('#tpBeaconMedia').empty()

	showBeacon: (e) =>
		ele = null
		target = null
		x = null
		reference = null
		y = null
		name = null
		match = null

		if(@TPB && @doubleView)
			ele = $(e.currentTarget).find('a.detLink')
		else if(@TPB)
			ele = $(e.currentTarget).find('td:nth-child(2) a')
		else if(@KAT)
			ele = $(e.currentTarget).find('a.cellMainLink')
		else if(@EXTRA)
			ele = $(e.currentTarget).find('td:nth-child(2) a:first-child')

		target = ele.attr('href')
		x = ele.offset().left
		reference = ele.offset().top - $(document).scrollTop()
		y = ele.offset().top

		if xhr1?
			xhr1.abort()

		if xhr2?
			xhr2.abort()

		xhr1 = $.ajax({
			url: target,
			dataType: 'html',
			success: (page) =>
				match = page.match(@regex)

				if(match != null && match.length && match[1] != '')
					$('#tpBeaconSpinner').show()
					$('#tpBeaconContent').hide()
					$("#tpBeacon").fadeIn(300)

					# tpBeacon height plus padding and arrow
					tpBeaconHeight = $("#tpBeacon").height() + 25 + 40

					x = x - 100 + @xAdjust()

					if (tpBeaconHeight > reference)
						y = y + 40
						$("#tpBeacon").css("left", x + 'px').css("top", y + 'px').css('bottom', 'auto')
						$(".tpBeacon-arrow").css({
							"background-position": "-60px top",
							"top": "-27px"
						})
					else
						y = $(window).height() - y + 20
						$("#tpBeacon").css("left", x + 'px').css("bottom", y + 'px').css('top', 'auto')
						$(".tpBeacon-arrow").css({
							"background-position": "left top",
							"top": "auto",
							"bottom": "-25px"
						});

					xhr2 = $.getJSON('https://api.jpatterson.me/beacon/movie/' + encodeURIComponent(match[1]), (response) =>
						response = response.movie
						$('#tpBeaconTitle').text(response.title)
						$('#tpBeaconRelease').text(response.released)
						$('#tpBeaconDescription').text(response.plot)
						if(response.imdbRating != 'N/A')
							$('#tpBeaconImdbRating').text(response.imdb_rating + '/10 (' + response.imdb_votes + ' reviews)')
						else
							$('#tpBeaconImdbRating').text('N/A')

						$('#tpBeaconLength').text(response.runtime)
						$('#tpBeaconDirector').text(response.director)
						if(response.tomato_meter != 'N/A')
							$('#tpBeaconRottenTomatoesCritics').text(response.tomato_meter + '% (' + response.tomato_reviews + ' reviews)')
						else
							$('#tpBeaconRottenTomatoesCritics').text('N/A')

						if(response.tomato_user_meter != 'N/A')
							$('#tpBeaconRottenTomatoesAudience').text(response.tomato_user_meter + '% (' + response.tomato_user_reviews + ' reviews)')
						else
							$('#tpBeaconRottenTomatoesAudience').text('N/A')


						if(response.trailer != null)
							youtube = response.trailer.match(/src=\"(.*?)\"/i)
							width = response.trailer.match(/width=\"(.*?)\"/i)
							height = response.trailer.match(/height=\"(.*?)\"/i)
							iframe = $('<iframe />').attr('height', height[1]).attr('width', width[1]).attr('frameborder', '0').attr('allowfullscreen', true).attr('src', youtube[1])
							$('#tpBeaconMedia').empty().append(iframe)
						else
							img = $('<img />').attr('height', '250').attr('src', 'https://api.jpatterson.me/beacon/movie/poster/' + encodeURIComponent(response.id))
							$('#tpBeaconMedia').append(img)

						$('#tpBeaconContent').show()
						$('#tpBeaconSpinner').hide()
					)
		})

	build: =>
		@linkTarget.removeAttr('title')
		$('body').append($('<div id="tpBeacon" style="display: none;position:absolute;min-height:260px;padding:20px;background:white;border:1px solid #eee;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;-webkit-box-shadow:0 0 10px rgba(0,0,0,0.69);-moz-box-shadow:0 0 10px rgba(0,0,0,0.69);box-shadow:0 0 10px rgba(0,0,0,0.69);z-index:100;left:50px;min-width:715px;">' +
				'<div id="tpBeaconContent" style="display:none;">' +
					'<div style="float: left;max-width: 250px;margin-right: 20px; text-align: left;">' +
						'<h3 id="tpBeaconTitle" style="text-transform: uppercase;margin-bottom: 0;margin-top: 0;"></h3>' +
						'<p id="tpBeaconRelease" style="font-size: 80%;color: #888;"></p>' +
						'<p id="tpBeaconDescription"></p>' +
						'<hr style="color: #eee;background-color: #eee;height: 2px;border: none;" />' +
						'<p><strong>IMDb Rating:</strong> <span id="tpBeaconImdbRating"></span></p>' +
						'<p><strong>RT Critics:</strong> <span id="tpBeaconRottenTomatoesCritics"></span></p>' +
						'<p><strong>RT Audience:</strong> <span id="tpBeaconRottenTomatoesAudience"></span></p>' +
						'<hr style="color: #eee;background-color: #eee;height: 2px;border: none;" />' +
						'<p><strong>Director:</strong> <span id="tpBeaconDirector"></span></p>' +
						'<p><strong>Length:</strong> <span id="tpBeaconLength"></span></p>' +
					'</div>' +
					'<div style="float: left;min-width: 445px;">' +
						'<a href="#" class="tpBeaconClose" style="border-bottom: none;display:none;float:right;right:0;margin-top:-12px;margin-right:-12px;width:15px;height:15px;margin-bottom:10px;background:transparent url(' + chrome.extension.getURL('img/arrows.png') + ') no-repeat right top;"></a>' +
						'<div id="tpBeaconMedia" style="min-width:444px;height:250px;text-align:center;"></div>' +
					'</div>' +
				'</div>' +
				'<div class="tpBeacon-arrow" style="width:45px;height:30px;background:transparent url(' + chrome.extension.getURL('img/arrows.png') + ') no-repeat left top;bottom:-25px;position:absolute;left:20%;margin-left:-30px;"></div>' +
				'<div style="position:absolute;top:115px;left:345px;" id="tpBeaconSpinner"><img src="' + chrome.extension.getURL('img/spinner.gif') + '" /></div>' +
			'</div>'))

tpBeacon = null

chrome.runtime.onMessage.addListener (msg, sender) ->
	if msg.enabled
		tpBeacon = new TPBeacon
	else
		if tpBeacon?
			tpBeacon.destroy()
			tpBeacon = null

chrome.runtime.sendMessage {id: 'isEnabled'}, (response) ->
	if response.value
		tpBeacon = new TPBeacon
	else
		if tpBeacon?
			tpBeacon.destroy()
			tpBeacon = null
