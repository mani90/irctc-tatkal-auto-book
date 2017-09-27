'use strict'

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': chrome.extension.getURL('irctc.html'), 'selected': true});
});
