var Controller = function() {

  var controller = {
      self: null,

      initialize: function() {
          self = this;
          self.bindEvents();
          self.renderFAQsView();
      },

      bindEvents: function() {
      	$('.tab-button').on('click', this.onTabClick);
        $('.back-button').on('click', function(){
          $('.back-button').toggleClass('active');
          controller.renderReportView();
        });
        $('#mandolapp-menu').on("click", "a", null, function () {
          $('#mandolapp-menu').collapse('hide');
        });
      },

      onTabClick: function(e) {
      	e.preventDefault();
          if ($(this).hasClass('active')) {
              return;
          }

          var tab = $(this).data('tab');
          switch(tab) {
            case "#home-tab":
              self.renderHomeView();
              break;
            case "#hatespeech-tab":
              self.renderHatespeechView();
              break;
            case "#report-tab":
              self.renderReportView();
              break;
            case "#faqs-tab":
              self.renderFAQsView();
              break;
            default:
              console.log("Error rendering view.");
          }
      },

      renderCropView: function(uri) {
        var $container = $('.container');
        $container.empty();
        $(".main-container").load("./views/crop.html", function(data) {
          $("form.crop-report").submit(function(e) {
            controller.renderCreateView(ocr_results);
            e.preventDefault();
          });
          var canvas = document.getElementsByTagName('canvas')[0];

          if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            var screenshot = new Image();
            screenshot.onload = function (){
              ctx.drawImage(screenshot, 0, 0, screenshot.width, screenshot.height, 0, 0, canvas.width, canvas.height );
            };
            screenshot.src = uri;
          }
          $('canvas.screenshot').Jcrop({
            onSelect: function () {
                var cropData = this.tellSelect();
                var canvas = document.createElement('canvas');
                var fxcanvas = fx.canvas();
                var texture = fxcanvas.texture(document.getElementsByClassName('screenshot')[0]);
                fxcanvas.draw(texture)
                  .hueSaturation(-1, -1)
                  .unsharpMask(20, 2)
                  .brightnessContrast(0.2, 0.9)
                  .update();
                canvas.width = cropData.w;
                canvas.height = cropData.h;
                var ctx = canvas.getContext('2d');
                var screenshot = new Image();
                screenshot.onload = function (){
                  ctx.drawImage(
                    screenshot,
                    cropData.x,
                    cropData.y,
                    cropData.w,
                    cropData.h,
                    0,
                    0,
                    cropData.w,
                    cropData.h
                  );
                };
                screenshot.src = fxcanvas.toDataURL();

                ocr_results = OCRAD(ctx);
                $('#ocr-button').removeClass('disabled');
                $('#ocr-button').removeAttr('disabled');
            }
          });
        });
        $('.back-button').toggleClass('active');
      },

      renderCreateView: function(annotated){
        var $container = $('.main-container');
        $container.empty();
        $(".main-container").load("./views/create.html", function(data) {
          $('#report-content').text(annotated);
          $("form.create-report").submit(function(e) {
            navigator.notification.alert("Your report has been received and will be evaluated.", function(e){
              inAppBrowser.show();
            }, "Thank you!", "OK");
            e.preventDefault();
          });
        });
        $('.back-button').toggleClass('active');
        $('.back-button').on('click', function(e){
          inAppBrowser.show();
        });
      },

      renderReportInfo: function(){
        var $container = $('.main-container');
        $container.empty();
        $(".main-container").load("./views/info.html", function(data) {
            //Bind view's events e.g. $('#tab-content').find('#post-project-form').on('submit', self.postProject);
        });
        $('.back-button').toggleClass('active');
      },

      renderHatespeechView: function() {
          $('.tab-button').removeClass('active');
          $('#hatespeech-btn').addClass('active');

          var $container = $('.main-container');
          $container.empty();
          $.get("https://m.facebook.com/story.php?story_fbid=10158250118600725&substory_index=0&id=153080620724", function(fb_page) {
            console.log(fb_page);
          });
      },

      renderReportView: function() {
          $('.tab-button').removeClass('active');
          $('#report-btn').addClass('active');

          var $container = $('.main-container');
          $container.empty();

          $(".main-container").load("./views/report.html", function(data) {
            $(".report-item").on("click", controller.renderReportInfo);
            $("#browser-btn").on("click", function(e){
              navigator.notification.prompt("Please enter a url.", function(url){
                inAppBrowser = cordova.InAppBrowser.open(url.input1, '_blank', 'location=yes, toolbar=no, zoom=no, editablelocation=yes');
                inAppBrowser.addEventListener('loaderror', function(e){
                  navigator.notification.alert(url.input1 + " could not be loaded.", function(e){
                    inAppBrowser.close();
                  }, "Error while loading", "OK");
                });
                inAppBrowser.addEventListener('loadstop', function() {
                  inAppBrowser.executeScript({file:"https://3ed88f5d.ngrok.io/mandolapp/www/js/report.js"});
                  inAppBrowser.insertCSS({file:"https://3ed88f5d.ngrok.io/mandolapp/www/css/report.css"});
                  inAppBrowser.executeScript({code: "localStorage.setItem('annotatedText', '')"});
                  listenForAnnotation = setInterval(function(){
                    inAppBrowser.executeScript({ code: "localStorage.getItem('annotatedText')" }, function(annotated) {
                      if(annotated!=''){
                        inAppBrowser.executeScript({code: "localStorage.setItem('annotatedText', '')"});
                        inAppBrowser.hide();
                        controller.renderCreateView(annotated);
                      }
                    });
                  }, 500);
                });
                inAppBrowser.addEventListener('exit', function() {
                    clearInterval(listenForAnnotation);
                });
              }, "Report via Browser", ["OK", "Cancel"], "http://www.google.com");
            });
            $("#image-btn").on("click", function(e){
              window.imagePicker.getPictures(
                function(results) {
                  for (var i = 0; i < results.length; i++) {
                    console.log('Image URI: ' + results[i]);
                    var options = {
                      allowEdit: true
                    };
                    controller.renderCropView(results[i]);
                  }
                }, function (error) {
                  console.log('Error: ' + error);
                }
              );
            });
            $('.menu-button').on('click', function(){
              $('.menu-button').toggleClass('pressed');
            })
          });

      },

      renderFAQsView: function() {
          $('.tab-button').removeClass('active');
          $('#faqs-btn').addClass('active');

          var $container = $('.main-container');
          $container.empty();

          $(".main-container").load("./views/faqs.html", function(data) {
            $('.ui.accordion').accordion();
          });
      }

  }

  controller.initialize();
  return controller;
}
