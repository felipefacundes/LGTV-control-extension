function lightPowerIcon(enabled)
{
    chrome.browserAction.setBadgeText({text: "+"});
    var color = enabled ? "green" : "red";
    chrome.browserAction.setBadgeBackgroundColor({color: color});
}

function saveSetting(name, value)
{
    localStorage.setItem(name, value);
}

function loadSetting(name)
{
    return localStorage.getItem(name);
}

var clearAuthToken = function()
{
    chrome.identity.getAuthToken({interactive:true},
        function(token) {
            if (token) {
                console.log(token); chrome.identity.removeCachedAuthToken({token: token},
                    function() {
                        console.log("Auth token cache cleared.");
                    }
                )
            }
        }
    );
};

/*
chrome.storage.local.set({key: value}, function() {
    console.log('Value is set to ' + value);
});

chrome.storage.local.get(['key'], function(result) {
    console.log('Value currently is ' + result.key);
});
*/
