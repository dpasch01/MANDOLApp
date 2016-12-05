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

      renderCreateView: function(annotated){
        var $container = $('.container');
        $container.empty();
        $(".container").load("./views/create.html", function(data) {
          $('#report-content').text(annotated);
        });
        $('.back-button').on('click', function(e){
          inAppBrowser.show();
        });
      },

      renderReportInfo: function(){
        var $container = $('.container');
        $container.empty();
        $(".container").load("./views/info.html", function(data) {
            //Bind view's events e.g. $('#tab-content').find('#post-project-form').on('submit', self.postProject);
        });
        $('.back-button').toggleClass('active');
      },

      renderHatespeechView: function() {
          $('.tab-button').removeClass('active');
          $('#hatespeech-btn').addClass('active');

          var $container = $('.container');
          $container.empty();
          $(".container").load("./views/hatespeech.html", function(data) {
              //Bind view's events e.g. $('#tab-content').find('#post-project-form').on('submit', self.postProject);
          });
      },

      renderReportView: function() {
          $('.tab-button').removeClass('active');
          $('#report-btn').addClass('active');

          var $container = $('.container');
          $container.empty();

          $(".container").load("./views/report.html", function(data) {
            $(".report-item").on("click", controller.renderReportInfo);
            $("#browser-btn").on("click", function(e){
              inAppBrowser = cordova.InAppBrowser.open('https://en.wikipedia.org/wiki/Main_Page', '_blank', 'location=yes, toolbar=no');
              inAppBrowser.addEventListener('loadstop', function() {
                inAppBrowser.executeScript({file:"https://ed0a7d4a.ngrok.io/mandolapp/www/js/report.js"});
                inAppBrowser.insertCSS({file:"https://ed0a7d4a.ngrok.io/mandolapp/www/css/report.css"});
                inAppBrowser.executeScript({code: "localStorage.setItem('annotatedText', '')"});
                var listenForAnnotation = setInterval(function(){
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
            });
            $("#image-btn").on("click", function(e){
              window.imagePicker.getPictures(
                function(results) {
                  for (var i = 0; i < results.length; i++) {
                    console.log('Image URI: ' + results[i]);
                    var options = {
                      allowEdit: true
                    };
                    plugins.crop(function success(path) {
                      console.log(path);
                    }, function fail () {
                      console.log("Error in crop.");
                    },results[i] , options);
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

          var $container = $('.container');
          $container.empty();
          $(".container").load("./views/faqs.html", function(data) {
              //Bind view's events e.g. $('#tab-content').find('#post-project-form').on('submit', self.postProject);
          });
      }

  }

  controller.initialize();
  return controller;
}
