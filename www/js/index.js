
$(document).on("deviceready", function() {

  function report(){
    navigator.screenshot.URI(function(error,res){
      if(error){
        console.error(error);
      }else{
        $(".screenshot").attr("src", res.URI);
      }
    }, 100);
  };

  function loadStartCallBack() {
    console.log("Loading..");
  }

  function loadStopCallBack() {
    console.log("Stopping CallBack..");
    if (inAppBrowserRef != undefined) {
      inAppBrowserRef.show();
    }
  }

  function loadErrorCallBack(params) {
    var scriptErrorMesssage = "alert('Sorry we cannot open that page. Message from the server is : " + params.message + "');"
    inAppBrowserRef.executeScript({ code: scriptErrorMesssage }, executeScriptCallBack);
    inAppBrowserRef.close();
    inAppBrowserRef = undefined;
  }

  function executeScriptCallBack(params) {
    if (params[0] == null) {
      $('#browser-btn').css("background-color","#FF0000");
    }
  }

  $("#report-btn").on("touchend", report);
  $("#browser-btn").on("click", function(e){
    var url = "http://www.google.com/";
    var target = "_blank";
    var options = {
      statusbar: {
        color: '#ffffffff'
      },
      toolbar: {
        height: 44,
        color: '#f0f0f0ff'
      },
      title: {
        color: '#003264ff',
        showPageTitle: true
      },
      backButton: {
        image: 'back',
        imagePressed: 'back_pressed',
        align: 'left',
        event: 'backPressed'
      },
      forwardButton: {
        image: 'forward',
        imagePressed: 'forward_pressed',
        align: 'left',
        event: 'forwardPressed'
      },
      closeButton: {
        image: 'close',
        imagePressed: 'close_pressed',
        align: 'left',
        event: 'closePressed'
      },
      customButtons: [
        {
            image: 'share',
            imagePressed: 'share_pressed',
            align: 'right',
            event: 'sharePressed'
        }
      ],
      menu: {
        image: 'menu',
        imagePressed: 'menu_pressed',
        title: 'Test',
        cancel: 'Cancel',
        align: 'right',
        items: [
            {
                event: 'helloPressed',
                label: 'Hello World!'
            },
            {
                event: 'testPressed',
                label: 'Test!'
            }
        ]
      }
    };

    inAppBrowserRef = cordova.ThemeableBrowser.open(url, target, options)
      .addEventListener('backPressed', function(e) {
        console.log('back pressed');
      }).addEventListener('helloPressed', function(e) {
        console.log('hello pressed');
      }).addEventListener('sharePressed', function(e) {
        console.log(e.url);
      }).addEventListener(cordova.ThemeableBrowser.EVT_ERR, function(e) {
        console.error(e.message);
      }).addEventListener(cordova.ThemeableBrowser.EVT_WRN, function(e) {
        console.error(e.message);
      });
  });

});

$(function(){

  var selection="";

  function getSelection(){
    if (window.getSelection) {
      selection = window.getSelection();
    } else if (document.selection) {
      selection = document.selection.createRange();
    }
  }

  $("body").bind( "taphold", tapholdHandler );
  function tapholdHandler(e){
    selection.toString() !== '' && alert('"' + selection.toString() + '" was selected at ' + e.pageX + '/' + e.pageY);
  }

  $("body").swipe({
    swipe: function(e, direction, distance, duration, fingerCount, fingerData) {
      getSelection();
      selection.toString() !== '' && alert('"' + selection.toString() + '" was selected at ' + e.pageX + '/' + e.pageY);
    },
    threshold:0
  });

  $("body").swipe({
    hold: function(e, target) {
      getSelection();
      selection.toString() !== '' && alert('"' + selection.toString() + '" was selected at ' + e.pageX + '/' + e.pageY);
    },
    threshold:50
  });

});
