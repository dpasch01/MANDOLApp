
$(document).on("deviceready", function() {
  var selection="";

  $("#browser-btn").on("click", function(e){
    var inAppBrowser = cordova.InAppBrowser.open('https://en.wikipedia.org/wiki/Main_Page', '_blank', 'location=no, toolbar=no');
    inAppBrowser.addEventListener('loadstop', function() {
      inAppBrowser.executeScript({file:"https://3932f31a.ngrok.io/mandolapp/www/js/report.js"});
      inAppBrowser.insertCSS({file:"https://3932f31a.ngrok.io/mandolapp/www/css/report.css"});
      inAppBrowser.executeScript({code: "localStorage.setItem('annotatedText', '')"});
      var listenForAnnotation = setInterval(function(){
        inAppBrowser.executeScript({ code: "localStorage.getItem('annotatedText')" }, function(annotated) {
          if(annotated!=''){
            console.log(annotated);
            inAppBrowser.executeScript({code: "localStorage.setItem('annotatedText', '')"});
            inAppBrowser.hide();
          }
        });
      }, 500);
    });

    inAppBrowser.addEventListener('exit', function() {
        clearInterval(listenForAnnotation);
    });
  });
});
