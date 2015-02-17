toggleEnabled = (cb) ->
	getEnabled (enabled) ->
		chrome.storage.sync.set "enabled": !enabled
		setText()
		cb(!enabled)

getEnabled = (cb) ->
	chrome.storage.sync.get "enabled", (val) ->
		if !val.enabled?
			chrome.storage.sync.set "enabled": true
			enabled = true
		else
			enabled = val.enabled

		cb(enabled)

onRequest = (request, sender, sendResponse) ->
	if request.id == 'isEnabled'
		getEnabled (enabled) ->
			sendResponse({value: enabled})
	true

setText = (cb) ->
	chrome.storage.sync.get "enabled", (val) ->
		if !val.enabled?
			chrome.storage.sync.set "enabled": true
			enabled = true
		else
			enabled = val.enabled

		if enabled
			chrome.browserAction.setBadgeText text: "On"
		else
			chrome.browserAction.setBadgeText text: "Off"

		cb?(enabled)

chrome.browserAction.onClicked.addListener (tab) ->
	toggleEnabled (enabled) ->
		chrome.tabs.sendMessage tab.id, {enabled: enabled}

chrome.runtime.onMessage.addListener(onRequest)

setText()