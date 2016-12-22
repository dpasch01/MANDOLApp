var Controller = function() {

  var controller = {
      self: null,

      initialize: function() {
          self = this;
          self.bindEvents();
          self.renderReportView();
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
          $(".main-container").load("./views/hatespeech.html", function(data) {
            var olympicsData = {
              labels: ['5th', '10th', '15th', '20th'],
              series: [
                [20, 40, 50, 60],
                [20, 25, 35, 40]
              ]
            };
            var electionsData = {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
              series: [
                [20, 25, 25, 30, 30, 35, 40, 45, 45, 45, 50],
                [10, 15, 15, 20, 20, 25, 30, 40, 50, 55, 55],
                [20, 25, 30, 30, 35, 40, 40, 50, 55, 55, 60],
              ]
            };
            var options = {
              lineSmooth: true,
              showPoint: true,
              axisX:{
                showGrid: false,
                showLabel: false
              },
              axisY:{
                showGrid: false,
                showLabel: false
              }
            }
            new Chartist.Line('.olympic-chart.ct-chart', olympicsData, options);
            new Chartist.Line('.election-chart.ct-chart', electionsData, options);

            window.sr = ScrollReveal({ duration: 600 });
            sr.reveal('.hatespeech-encounter .encountered i', 25);
            sr.reveal('.hatespeech-encounter .attacked i', 25);
            sr.reveal('.hatespeech-encounter .info', {
              origin: 'bottom',
              duration: 800
            });
            sr.reveal('h1', {
              origin: 'top',
              duration: 800
            });
            sr.reveal('.bar-container', {
              origin: 'left',
              duration: 800
            });
            sr.reveal('.hate-country', {
              origin: 'left',
              duration: 800
            });
            sr.reveal('.event', {
              origin: 'bottom',
              duration: 800
            });

            $(window).scroll(startCounter);

            function number_format(number, decimals, dec_point, thousands_sep){
              var n = !isFinite(+number) ? 0 : +number,
              prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
              sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
              dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
              toFixedFix = function (n, prec) {
                  var k = Math.pow(10, prec);
                  return Math.round(n * k) / k;
              },
              s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
              if (s[0].length > 3) {
                  s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
              }
              if ((s[1] || '').length < prec) {
                  s[1] = s[1] || '';
                  s[1] += new Array(prec - s[1].length + 1).join('0');
              }
              return s.join(dec);
            }

            function startCounter() {
              var scrollTop = $(window).scrollTop(),
              elementOffset = $('.hatespeech-count').offset().top,
              distance = (elementOffset - scrollTop);

              if ($(window).scrollTop() > distance) {
                $(window).off("scroll", startCounter);
                $('.hatespeech-count').each(function () {
                  var $this = $(this);
                  jQuery({ Counter: 0 }).animate({ Counter: 1500000 }, {
                    duration: 1000,
                    easing: 'swing',
                    step: function () {
                      $this.text(number_format(Math.ceil(this.Counter)));
                    }
                  });
                });
              }
            }
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
            $("#observe-btn").on("click", function(e){
              cordovafloatingactivity.startFloatingActivity('kakka',
                function(){
                  console.log("Reporting bubble activated.");
                },
                function(){
                  console.log("Error in activating reporting bubble.");
                }
              );
              cordovafloatingactivity.onFloatPressed('kakka',
                function(){
                  alert("Bubble pressed.");
                },
                function(){
                  alert("Error in bubble.");
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
            faqsList = $('.faqs-list').html();

            var filterInput = document.getElementsByClassName('filter-input')[0];

            filterInput.addEventListener('input', function(e){
              var query = document.getElementsByClassName('filter-input')[0].value.trim().toLowerCase();

              $('.faqs-list').html(faqsList);

              if(query.length > 0){
                var titleFlag = false;
                var queryResults = "";
                $.each($('.faqs-list li'), function(index, value){
                  if(($(value).hasClass("title") && $(value).text().trim().toLowerCase().includes(query)) || titleFlag){
                    if($(value).hasClass("title")){
                      queryResults+=$(value).wrap("<li class='title'></li>").parent().html();
                    }else{
                      queryResults+=$(value).wrap("<li class='content'></li>").parent().html();
                    }
                    titleFlag=!titleFlag;
                  }
                });
              }else{
                var queryResults = faqsList;
              }

              if(queryResults.length==0){
                $('.faqs-list').html("<div class='no-results'>No results found.</div>");
              }else{
                $('.faqs-list').html(queryResults);
              }

            });

            window.sr = ScrollReveal({ duration: 800 });
            sr.reveal('h1', {
              origin: 'top',
              duration: 800
            });
            sr.reveal('.filter-box', {
              origin: 'left',
              duration: 800
            });
            sr.reveal('.container', {
              origin: 'bottom',
              duration: 800
            });
          });
      }

  }

  controller.initialize();
  return controller;
}
