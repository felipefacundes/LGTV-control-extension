var openUrl = function(url)
{
     open_browser_at(url, function(err, msg){
        console.log(err, msg);
    });
};

chrome.runtime.onInstalled.addListener(function() {
chrome.contextMenus.create({
      "id": "send_link_to_tv",
      "type" : "normal",
      "title": chrome.i18n.getMessage("open_link_on_tv"),
      "contexts": ["all"]
});
});

var sendLinkToTV = function(e) {

            var url = e.pageUrl;

            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
                  url = tabs[0].url;
                  });

            if (e.mediaType === "image") {
                  url = encodeURI(e.srcUrl);
            }

            if (e.linkUrl) {
                  // The user wants to buzz a link.
                  url = e.linkUrl;
            }

            console.log("sendLinkToTV: ", url);

            if (isConnected)
            {
                openUrl(url);
            }
            else
            {
                connect(getIp(), function() { openUrl(url);});
            }
}

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == "send_link_to_tv") {
        sendLinkToTV(info);
    }
});

function update()
{
    console.log("update");

    if (!isConnected)
    {
        console.log("connecting...");
        connect(getIp(), get_status(function (res, msg) { lightPowerIcon(res); }));
    }

    get_status(function (res, msg) { lightPowerIcon(res); });

}

chrome.runtime.onStartup.addListener(function() { update(); chrome.alarms.create({periodInMinutes: 1}); });
chrome.alarms.onAlarm.addListener(update);

