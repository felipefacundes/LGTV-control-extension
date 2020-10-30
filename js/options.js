function showInfo(text, delay)
{
    var status = document.getElementById("status");
    status.textContent = text;

    if (delay != undefined)
    {
        setTimeout(function() {
                status.textContent = "";
                }, delay);
    }
}

function saveOptions()
{
    saveSetting("deviceIp", document.getElementById("deviceip").value);
    saveSetting("fontSize", document.getElementById("fontsize").value);
    saveSetting("bgColor", document.getElementById("background_color").value);
    showInfo(chrome.i18n.getMessage("options_saved"), 1000);
}

function connectionStatus(state)
{
     showInfo(chrome.i18n.getMessage("connection_to_device") + state);
}

function testConnection()
{
    deviceip = document.getElementById("deviceip").value;
    connectionStatus(connected() ? "OK" : "NOK!");
}

document.getElementById("saveButton").addEventListener("click", saveOptions);
//document.getElementById("clearCache").addEventListener("click", clearAuthToken);

var restoreSettings = function()
{
    // set default
    if (!loadSetting("fontSize"))
    {
        saveSetting("fontSize", 16);
    }

    // set default
    if (!loadSetting("bgColor"))
    {
        saveSetting("bgColor", "CEE4D9");
    }

    var bgColor = loadSetting("bgColor");
    var deviceIp = loadSetting("deviceIp");
    var fontSize = loadSetting("fontSize");

    document.getElementById("background_color").style.backgroundColor = "#" + bgColor;
    document.getElementById("background_color").value = bgColor;

    document.getElementById("deviceip").value = deviceIp;
    document.getElementById("fontsize").value = fontSize;

    connect(deviceIp, init);
};

var setupUIMessages = function()
{
    document.getElementById("settingsTitle").textContent = chrome.i18n.getMessage("settings_title");
    document.getElementById("deviceIpLabel").textContent = chrome.i18n.getMessage("device_ip_label");
    document.getElementById("backgroundColorLabel").textContent = chrome.i18n.getMessage("background_color_label");
    document.getElementById("fontSizeLabel").textContent = chrome.i18n.getMessage("font_size_label");
    document.getElementById("saveButton").innerHTML = chrome.i18n.getMessage("save");
   // document.getElementById("clearCache").innerHTML = chrome.i18n.getMessage("clear_auth_cache");
};

$(function()
{
    setupUIMessages();
    restoreSettings();
});

