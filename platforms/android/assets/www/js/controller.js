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

      renderLoadingView: function(){
        var $container = $('.main-container');
        $container.empty();

        $(".main-container").load("./views/loading.html", function(data){

        });
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
        $(".main-container").load("./views/annotator.html", function(data) {

          function hasClass(element, className) {
            return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
          }

          function addClass(element, className){
            if (!hasClass(element, className)) {
              element.className = element.className + " " + className;
            }
          }

          function removeClass(element, className) {
            if (hasClass(element, className)) {
              var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
              element.className = element.className.replace(reg,' ');
            }
          }

          function toggleClass(element, className){
            if (hasClass(element, className)){
              removeClass(element, className);
            }else{
              addClass(element, className);
            }
          }

          mostRecentHighlight = {};
          hltr = new TextHighlighter(document, {
            onBeforeHighlight: function (range) {
              document.querySelector(".mandola-annotator-container .mandola-annotator-url").textContent = "https://www.codecourse.com/lessons/api-development-with-laravel";
              document.querySelector(".mandola-annotator-container .mandola-annotator-content-text").textContent = range;
              removeClass(document.querySelector('.mandola-annotator-container'), 'mandola-annotator-hidden');
              removeClass(document.querySelector('.mandola-annotator-form'), 'mandola-annotator-hidden');
              return true;
            },
            onAfterHighlight: function (range, highlights, timestamp) {
              mostRecentHighlight.timestamp = timestamp;
              mostRecentHighlight.text = range;
            }
          });

          document.querySelector('#mandola-annotator-categories').addEventListener('click', function(){
            toggleClass(document.querySelector('#mandola-annotator-categories'), 'pressed');
            document.querySelector('#mandola-annotator-categories').blur();
            document.querySelector(".mandola-annotator-body").scrollTo(0, document.querySelector(".mandola-annotator-body").scrollHeight);
          });

          document.querySelectorAll('.mandola-annotator-category').forEach(function(element, index, array){
            element.addEventListener('click', function(){
              toggleClass(element, 'active');
              var categories = "";
              document.querySelectorAll(".mandola-annotator-category.active").forEach(function(element, index, array){
                if(index === 0){
                  categories = element.textContent;
                }else{
                  categories += ", " + element.textContent;
                }
              });
              document.querySelector('#mandola-annotator-categories').value = categories;
            });
          });

          document.querySelector('.mandola-annotator-close').addEventListener('click', function(event){
            removeRecentHighlight();
            addClass(  document.querySelector('.mandola-annotator-container'), 'mandola-annotator-hidden');
            addClass(document.querySelector('.mandola-annotator-form'), 'mandola-annotator-hidden');
            resetMandola();
            event.stopPropagation();
          });

          document.querySelector('.mandola-annotator-submit-button').addEventListener('click', function(event){
            document.querySelector('.mandola-annotator-form [type="submit"]').click();
          });

          document.querySelector('.mandola-annotator-status-button').addEventListener('click', function(event){
            addClass(document.querySelector('.mandola-annotator-status-container'), 'mandola-annotator-hidden');
            if(hasClass(document.querySelector('.mandola-annotator-status-thumbnail'), 'mandola-annotator-success')){
              removeClass(document.querySelector('.mandola-annotator-status-thumbnail'), 'mandola-annotator-success');
            }else{
              removeClass(document.querySelector('.mandola-annotator-status-thumbnail'), 'mandola-annotator-failure');
            }
            addClass(document.querySelector('.mandola-annotator-container'), 'mandola-annotator-hidden');
            addClass(document.querySelector('.mandola-annotator-form'), 'mandola-annotator-hidden');
          });

          document.querySelector('.mandola-annotator-form').addEventListener("submit", function(event){
            var recentHightlight = document.querySelector('span.highlighted[data-timestamp="' + mostRecentHighlight.timestamp + '"]');
            recentHightlight.addEventListener('click', function(event){
              console.log(event.target);
            });

            showSuccessMessage();
            resetMandola();
            event.stopPropagation();
            event.preventDefault();
          });

          function showSuccessMessage(){
            document.querySelector('.mandola-annotator-status-title').innerHTML = "Thank you!";
            document.querySelector('.mandola-annotator-status-message').innerHTML = "Your report on <span class=\"mandola-annotator-url\">" + window.location.href + "</span> has been submitted and will be reviewed. You will be informed on the analysis results.";
            addClass(document.querySelector('.mandola-annotator-status-thumbnail'), 'mandola-annotator-success');
            addClass(document.querySelector('.mandola-annotator-form'), 'mandola-annotator-hidden');
            removeClass(document.querySelector('.mandola-annotator-status-container'), 'mandola-annotator-hidden');
          }

          function showFailureMessage(){
            document.querySelector('.mandola-annotator-status-title').innerHTML = "Failed!";
            document.querySelector('.mandola-annotator-status-message').innerHTML = "Your report on <span class=\"mandola-annotator-url\">" + window.location.href + "</span> could not be submitted due to an error. Please try again.";
            addClass(document.querySelector('.mandola-annotator-status-thumbnail'), 'mandola-annotator-failure');
            addClass(document.querySelector('.mandola-annotator-form'), 'mandola-annotator-hidden');
            removeClass(document.querySelector('.mandola-annotator-status-container'), 'mandola-annotator-hidden');
          }

          function removeRecentHighlight(){
            var recentHightlight = document.querySelector('span.highlighted[data-timestamp="' + mostRecentHighlight.timestamp + '"]');
            recentHightlight.outerHTML = recentHightlight.innerHTML;
          }

          function resetMandola(){
            if(hasClass(document.querySelector('#mandola-annotator-categories'), 'pressed')){
              document.querySelectorAll('#mandola-annotator-categories').forEach(function(element, index, array){
                removeClass(element, 'pressed');
              });
            }
            document.querySelectorAll(".mandola-annotator-category.active").forEach(function(element, index, array){
              removeClass(element, 'active');
            });
            document.querySelector('#mandola-annotator-categories').value = "";
            document.querySelector('#mandola-annotator-title').value = "";
            document.querySelector('.mandola-annotator-content-text').innerHTML = "";
            document.querySelector('.mandola-annotator-url').innerHTML = "";
          }

        // $(".main-container").load("./views/create.html", function(data) {
        //   $('#report-content').text(annotated);
        //   $("form.create-report").submit(function(e) {
        //     navigator.notification.alert("Your report has been received and will be evaluated.", function(e){
        //       inAppBrowser.show();
        //     }, "Thank you!", "OK");
        //     e.preventDefault();
        //   });
        });
        // $('.back-button').toggleClass('active');
        // $('.back-button').on('click', function(e){
        //   inAppBrowser.show();
        // });
      },

      renderReportInfo: function(){
        var $container = $('.main-container');
        $container.empty();
        $(".main-container").load("./views/info.html", function(data) {

        });
        $('.back-button').addClass('active');
      },

      renderHatespeechView: function() {
          $('.tab-button').removeClass('active');
          $('.back-button').removeClass('active');
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

      renderMandolaProxyView: function(URL){
        var $container = $('.main-container');
        $container.empty();
        $('#hatespeech-btn').addClass('active');

        MANDOLA_PROXY_PREFIX = "http://mandola.grid.ucy.ac.cy:9080/";

        $(".main-container").load("./views/iframe.html", function(data){
          $(".iframe-wrapper").html('<object class="mandola-proxy-iframe" data="' + MANDOLA_PROXY_PREFIX + URL + '">');
          $('.mandola-proxy-iframe').on('load', function(){
            console.log("URL: " + MANDOLA_PROXY_PREFIX + URL);
          });
        });

      },

      renderReportView: function() {
          $('.tab-button').removeClass('active');
          $('#report-btn').addClass('active');
          var $container = $('.main-container');
          $container.empty();

          MANDOLA_PROXY_PREFIX = "http://mandola.grid.ucy.ac.cy:9080/";

          $(".main-container").load("./views/report.html", function(data) {
            $(".report-item").on("click", controller.renderReportInfo);

            $("#browser-btn").on("click", function(e){
              swal({
                title: 'Enter a URL to annotate',
                input: 'text',
                showCancelButton: true,
                confirmButtonText: 'Load',
                showLoaderOnConfirm: false,
                preConfirm: function(mandolaURL) {
                  return new Promise(function(resolve, reject) {
                    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                    if(!regexp.test(mandolaURL) || mandolaURL === ""){
                      reject('Please provide a valid URL.');
                    }else{
                      resolve();
                    }
                  });
                },
                allowOutsideClick: true
              }).then(function (mandolaURL) {
                controller.renderLoadingView();
                inAppBrowser = cordova.InAppBrowser.open(MANDOLA_PROXY_PREFIX + mandolaURL, '_blank',  'hidden=yes, location=yes, toolbar=no, zoom=no');
                inAppBrowser.addEventListener('loaderror', function(e){
                  swal('Oops...', 'Could not load: ' + mandolaURL, 'error');
                  inAppBrowser.close();
                  controller.renderReportView();
                });
                inAppBrowser.addEventListener('loadstop', function() {
                  MAODate = new Date();
                  MAO = {
                    "uuid": device.uuid,
                    "created": MAODate,
                    "updated": MAODate,
                    "reports": []
                  };
                  inAppBrowser.executeScript({ code: "localStorage.setItem('MAO', '" + JSON.stringify(MAO) + "');" });
                  inAppBrowser.executeScript({ code: "localStorage.setItem('TEST', '{ \"uuid\": \"kakka\"}');" });
                  MAOObserver = setInterval(function(){
                    inAppBrowser.executeScript({ code: "localStorage.getItem('MAO')" }, function(values) {
                      if(values[0]){
                        var tempMAO = JSON.parse(values[0]);
                        if(tempMAO.updated != MAODate){
                          MAO = tempMAO;
                        }
                      }else{
                        console.log("MANDOLA Application Object not found.");
                      }
                    });
                  }, 100);
                  controller.renderReportView();
                  inAppBrowser.show();
                });
                inAppBrowser.addEventListener('exit', function(){
                  console.log(MAO);
                  delete MAO;
                  clearInterval(MAOObserver);
                  localStorage.clear();
                });
              }).catch(swal.noop);

            });

            $("#image-btn").on("click", function(e){
              //Commands to be executed when the image select button is pressed.
            });

            function inflateBubble(){
              cordovafloatingactivity.startFloatingActivity('screenshot-btn',
                function(){
                  cordova.plugins.backgroundMode.setDefaults({ text:'Still hunting for hatespeech.'});
                  cordova.plugins.backgroundMode.enable();
                  console.log("Reporting bubble activated.");
                },
                function(){
                  console.log("Error in activating reporting bubble.");
                }
              );
              cordovafloatingactivity.onFloatPressed('screenshot-btn',
                function(){
                  console.log("Success in firing onFloatPressed.");
                  navigator.screenshot.URI(function(error,res){
                    if(error){
                      console.error(error);
                    }else{
                      html = '<img style="width:100%;" class="hatespeech-encounter-img" src="'+res.URI+'">';
                      document.body.innerHTML = html;
                      console.log(res);
                    }
                  },50);
                },
                function(){
                  console.log("Error in onFloatPressed.");
                }
              );
            }

            function requestPermission(){
              cordova.plugins.diagnostic.requestRuntimePermission(
                function(status){
                  switch(status){
                    case cordova.plugins.diagnostic.runtimePermissionStatus.GRANTED:
                      console.log("Permission WRITE_EXTERNAL_STORAGE is granted.");
                      break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.NOT_REQUESTED:
                      console.log("Permission WRITE_EXTERNAL_STORAGE is not yet requested.");
                      break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED:
                      console.log("Permission WRITE_EXTERNAL_STORAGE is denied.");
                      break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED_ALWAYS:
                      console.log("Permission WRITE_EXTERNAL_STORAGE is not permitted.");
                      break;
                  }
                }, function(error){
                    console.error("The following error occurred: " + error);
                },
                cordova.plugins.diagnostic.runtimePermission.WRITE_EXTERNAL_STORAGE
              );
            }

            $("#observe-btn").on("click", function(e){
              cordova.plugins.diagnostic.getPermissionAuthorizationStatus(
                function(status){
                  switch(status){
                    case cordova.plugins.diagnostic.runtimePermissionStatus.GRANTED:
                      inflateBubble();
                      console.log("Permission WRITE_EXTERNAL_STORAGE is granted.");
                      break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.NOT_REQUESTED:
                      console.log("Permission WRITE_EXTERNAL_STORAGE is not yet requested.");
                      requestPermission();
                      break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED:
                      console.log("Permission WRITE_EXTERNAL_STORAGE is denied.");
                      requestPermission();
                      break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED_ALWAYS:
                      console.log("Permission WRITE_EXTERNAL_STORAGE is not permitted.");
                      requestPermission();
                      break;
                  }
                }, function(error){
                    console.error("The following error occurred: " + error);
                },
                cordova.plugins.diagnostic.runtimePermission.WRITE_EXTERNAL_STORAGE
              );

            });

            function generateFavicon(URL){
              return URL.replace(/^(http:\/\/[^\/]+).*$/, '$1') + '/favicon.ico';
            }

            $('.menu-button').on('click', function(){
              $('.menu-button').toggleClass('pressed');
            });

          });

      },

      renderFAQsView: function() {
          $('.tab-button').removeClass('active');
          $('.back-button').removeClass('active');
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
