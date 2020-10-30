var windowWidth;
var windowHeight;
var currentX = 0;
var currentY = 0;
var mouseSensitiveBorderSize = 60;
var positionShift = 20;

var move = function(x, y)
{
     if (x > windowWidth - mouseSensitiveBorderSize)
     {
        currentX -= positionShift;
     }
     else if (x < mouseSensitiveBorderSize)
     {
        currentX += positionShift;
     }

     if (y > windowHeight - mouseSensitiveBorderSize)
     {
        currentY -= positionShift;
     }
     else if (y < mouseSensitiveBorderSize)
     {
        currentY += positionShift;
     }

     pointer_move(x - currentX, y - currentY);
     currentX = x;
     currentY = y;
};

var updatePosition = function(e)
{
    var obj = document.getElementById("mousepad");
    var obj_left = 0;
    var obj_top = 0;
    var xpos;
    var ypos;

    while (obj.offsetParent)
    {
        obj_left += obj.offsetLeft;
        obj_top += obj.offsetTop;
        obj = obj.offsetParent;
    }

    if (e)
    {
        xpos = e.pageX;
        ypos = e.pageY;
    }

    xpos -= obj_left;
    ypos -= obj_top;


    if (e.ctrlKey != true)
    {
        move(xpos, ypos);
    }
};

var pointerScroll = function(event)
{
    var delta = event.deltaY > 0 ? -1 : 1;
    scroll(0, delta);
};

var pointerClick = function(event)
{
    click();
};

var enableMouseCapture = function()
{
      var mousepad = document.getElementById("mousepad");

      mousepad.addEventListener("mousemove", updatePosition, false);
      mousepad.addEventListener("mousewheel", pointerScroll);
      mousepad.addEventListener("click", pointerClick);
};

var killme = function()
{
    debugLog("killme");
    close_pointer_socket();
    fullscreen(false);
    setTimeout(function() { window.close(); }, 300);
};

var keyDown = function(e)
{
    if (e.keyCode == 13)
    {
        var textEditor = this;

        replace_text(textEditor.value, debugLog);
        input_enter(debugLog);
        textEditor.value = "";
    }
    else if (e.keyCode == 27 || e.keyCode == 122)
    {
        killme();
    }
    else
    {
        handleKeyboard(e);
    }
};

var handleKeyboardEvent = function(err, resp) {
    var focused = false;
    var focusChanged = false;

    if (resp && resp.payload && resp.payload.currentWidget) {
        var currentWidget = resp.payload.currentWidget;
        focused = currentWidget.focus;
        focusChanged = currentWidget.focusChanged;
    }

    var editor = document.getElementById("texteditor");
    editor.style.display = (focused ? "block" : "none");
    editor.focus();

    if (focused)
    {
        replace_text("", debugLog);
    }
};

var windowState;

var fullscreen = function(enabled)
{
    chrome.windows.getCurrent(function (w) {
        if (enabled)
        {
            windowState = w.state;
            chrome.windows.update(w.id, { state: "fullscreen" });
        }
        else
        {
            chrome.windows.update(w.id, { state: windowState });
        }
    });
};

document.getElementById("texteditor").addEventListener("keydown", keyDown);
document.addEventListener("keydown", keyDown);

var isFullScreen = function()
{
};

var init = function()
{
      init_pointer_socket(debugLog);
      register_keyboard(handleKeyboardEvent);
      enableMouseCapture();
      fullscreen(true);

      var canvas = document.getElementById("mousepad");
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      var ctx = canvas.getContext("2d");
      var border = mouseSensitiveBorderSize;
      ctx.fillStyle="lightgrey";
      ctx.fillRect(border, border, ctx.canvas.width - 2 * border, ctx.canvas.height - 2 * border);
      ctx.stroke();
};

var forceFullscreen = function()
{
   chrome.windows.getCurrent(function (w) {
            if (w.state != "fullscreen")
            {
              killme();
            }
   });
};

var setupUIMessages = function()
{
    document.getElementById("magicRemoteTitle").textContent = chrome.i18n.getMessage("magic_remote_title");
    document.getElementById("magicRemoteHelp").textContent = chrome.i18n.getMessage("magic_remote_help");
}

var restoreSettings = function()
{
    var deviceIp = loadSetting("deviceIp");
    connect(deviceIp, init);
};


window.onload = function()
{
    setupUIMessages();

    windowWidth = document.getElementById("mousepad").clientWidth;
    windowHeight = document.getElementById("mousepad").clientHeight;

    restoreSettings();

    window.addEventListener("resize", forceFullscreen);
};

