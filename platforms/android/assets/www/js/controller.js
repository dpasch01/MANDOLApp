var Controller = function() {

    var controller = {
        self: null,

        user_settings: {
            "default_language": 'English',
            "default_language_code": 'eng',
            "keep_cropped": true,
            "hatespeech_analysis": false
        },

        installed_languages: [],

        all_languages: [{
                "code": "afr",
                "text": "Afrikaans"
            },
            {
                "code": "sqi",
                "text": "Albanian"
            },
            {
                "code": "amh",
                "text": "Amharic"
            },
            {
                "code": "ara",
                "text": "Arabic"
            },
            {
                "code": "asm",
                "text": "Assamese"
            },
            {
                "code": "aze",
                "text": "Azerbaijani"
            },
            {
                "code": "aze_cyrl",
                "text": "Azerbaijani - Cyrilic"
            },
            {
                "code": "eus",
                "text": "Basque"
            },
            {
                "code": "bel",
                "text": "Belarusian"
            },
            {
                "code": "ben",
                "text": "Bengali"
            },
            {
                "code": "bos",
                "text": "Bosnian"
            },
            {
                "code": "bul",
                "text": "Bulgarian"
            },
            {
                "code": "mya",
                "text": "Burmese"
            },
            {
                "code": "cat",
                "text": "Catalan; Valencian"
            },
            {
                "code": "ceb",
                "text": "Cebuano"
            },
            {
                "code": "khm",
                "text": "Central Khmer"
            },
            {
                "code": "chr",
                "text": "Cherokee"
            },
            {
                "code": "chi_sim",
                "text": "Chinese - Simplified"
            },
            {
                "code": "chi_tra",
                "text": "Chinese - Traditional"
            },
            {
                "code": "hrv",
                "text": "Croatian"
            },
            {
                "code": "ces",
                "text": "Czech"
            },
            {
                "code": "dan",
                "text": "Danish"
            },
            {
                "code": "nld",
                "text": "Dutch; Flemish"
            },
            {
                "code": "dzo",
                "text": "Dzongkha"
            },
            {
                "code": "eng",
                "text": "English"
            },
            {
                "code": "epo",
                "text": "Esperanto"
            },
            {
                "code": "est",
                "text": "Estonian"
            },
            {
                "code": "fin",
                "text": "Finnish"
            },
            {
                "code": "frk",
                "text": "Frankish"
            },
            {
                "code": "fra",
                "text": "French"
            },
            {
                "code": "glg",
                "text": "Galician"
            },
            {
                "code": "kat",
                "text": "Georgian"
            },
            {
                "code": "deu",
                "text": "German"
            },
            {
                "code": "ell",
                "text": "Greek"
            },
            {
                "code": "guj",
                "text": "Gujarati"
            },
            {
                "code": "hat",
                "text": "Haitian; Haitian Creole"
            },
            {
                "code": "heb",
                "text": "Hebrew"
            },
            {
                "code": "hin",
                "text": "Hindi"
            },
            {
                "code": "hun",
                "text": "Hungarian"
            },
            {
                "code": "isl",
                "text": "Icelandic"
            },
            {
                "code": "ind",
                "text": "Indonesian"
            },
            {
                "code": "iku",
                "text": "Inuktitut"
            },
            {
                "code": "gle",
                "text": "Irish"
            },
            {
                "code": "ita",
                "text": "Italian"
            },
            {
                "code": "jav",
                "text": "Javanese"
            },
            {
                "code": "jpn",
                "text": "Japanese"
            },
            {
                "code": "kan",
                "text": "Kannada"
            },
            {
                "code": "kaz",
                "text": "Kazakh"
            },
            {
                "code": "kir",
                "text": "Kirghiz; Kyrgyz"
            },
            {
                "code": "kor",
                "text": "Korean"
            },
            {
                "code": "kur",
                "text": "Kurdish"
            },
            {
                "code": "lao",
                "text": "Lao"
            },
            {
                "code": "lat",
                "text": "Latin"
            },
            {
                "code": "lav",
                "text": "Latvian"
            },
            {
                "code": "lit",
                "text": "Lithuanian"
            },
            {
                "code": "mkd",
                "text": "Macedonian"
            },
            {
                "code": "msa",
                "text": "Malay"
            },
            {
                "code": "mal",
                "text": "Malayalam"
            },
            {
                "code": "mlt",
                "text": "Maltese"
            },
            {
                "code": "mar",
                "text": "Marathi"
            },
            {
                "code": "nep",
                "text": "Nepali"
            },
            {
                "code": "nor",
                "text": "Norwegian"
            },
            {
                "code": "ori",
                "text": "Oriya"
            },
            {
                "code": "pan",
                "text": "Panjabi; Punjabi"
            },
            {
                "code": "fas",
                "text": "Persian"
            },
            {
                "code": "pol",
                "text": "Polish"
            },
            {
                "code": "por",
                "text": "Portuguese"
            },
            {
                "code": "pus",
                "text": "Pushto; Pashto"
            },
            {
                "code": "ron",
                "text": "Romanian; Moldavian; Moldovan"
            },
            {
                "code": "rus",
                "text": "Russian"
            },
            {
                "code": "san",
                "text": "Sanskrit"
            },
            {
                "code": "srp",
                "text": "Serbian"
            },
            {
                "code": "srp_latn",
                "text": "Serbian - Latin"
            },
            {
                "code": "sin",
                "text": "Sinhala; Sinhalese"
            },
            {
                "code": "slk",
                "text": "Slovak"
            },
            {
                "code": "slv",
                "text": "Slovenian"
            },
            {
                "code": "spa",
                "text": "Spanish; Castilian"
            },
            {
                "code": "swa",
                "text": "Swahili"
            },
            {
                "code": "swe",
                "text": "Swedish"
            },
            {
                "code": "syr",
                "text": "Syriac"
            },
            {
                "code": "tgl",
                "text": "Tagalog"
            },
            {
                "code": "tgk",
                "text": "Tajik"
            },
            {
                "code": "tam",
                "text": "Tamil"
            },
            {
                "code": "tel",
                "text": "Telugu"
            },
            {
                "code": "tha",
                "text": "Thai"
            },
            {
                "code": "bod",
                "text": "Tibetan"
            },
            {
                "code": "tir",
                "text": "Tigrinya"
            },
            {
                "code": "tur",
                "text": "Turkish"
            },
            {
                "code": "uig",
                "text": "Uighur; Uyghur"
            },
            {
                "code": "ukr",
                "text": "Ukrainian"
            },
            {
                "code": "urd",
                "text": "Urdu"
            },
            {
                "code": "uzb",
                "text": "Uzbek"
            },
            {
                "code": "uzb_cyrl",
                "text": "Uzbek - Cyrilic"
            },
            {
                "code": "vie",
                "text": "Vietnamese"
            },
            {
                "code": "cym",
                "text": "Welsh"
            },
            {
                "code": "yid",
                "text": "Yiddish"
            }
        ],

        request_runtime_permission: function(){
          cordova.plugins.diagnostic.requestRuntimePermission(
              function(status) {
                  switch (status) {
                      case cordova.plugins.diagnostic.runtimePermissionStatus.GRANTED:
                          console.log("=== WRITE_EXTERNAL_STORAGE GRANTED ===");
                          break;
                      case cordova.plugins.diagnostic.runtimePermissionStatus.NOT_REQUESTED:
                          console.log("=== WRITE_EXTERNAL_STORAGE NOT REQUESTED ===");
                          break;
                      case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED:
                          console.log("=== WRITE_EXTERNAL_STORAGE DENIED ===");
                          break;
                      case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED_ALWAYS:
                          console.log("=== WRITE_EXTERNAL_STORAGE NOT PERMITTED ===");
                          break;
                  }
              },
              function(error) {
                  console.error("The following error occurred: " + error);
              },
              cordova.plugins.diagnostic.runtimePermission.WRITE_EXTERNAL_STORAGE
          );
        },

        initialize: function() {
            self = this;
            self.bindEvents();
            self.renderReportView();

            self.request_runtime_permission();

            var newLangPath = cordova.file.dataDirectory + "files/";
            window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "tessdata/eng.traineddata", function(assetLangEntry) {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                    fileSystem.root.getDirectory('tessdata', {
                        create: true
                    }, function(parentDir) {
                        console.log("=== COPYING TESSERACT FILES ===");
                        assetLangEntry.copyTo(parentDir, "eng.traineddata", function() {
                            console.log("=== TESSERACT FILES COPIED ===");
                            var path = cordova.file.dataDirectory + "/files/tessdata/";
                            console.log("=== LISTING TESSERACT FILES ===");
                            window.resolveLocalFileSystemURL(path, function(fileSystem) {
                                var reader = fileSystem.createReader();
                                reader.readEntries(function(entries) {
                                    for (var i = 0; i < entries.length; i++) {
                                        entries[i].file(function(file) {
                                            if (file.name.indexOf(".traineddata") !== -1) {
                                                lang = file.name.replace(".traineddata", "");
                                                self.installed_languages.push(lang);
                                            }
                                        });
                                    }
                                }, function(error) {
                                    console.log("error: " + error);
                                });
                                console.log("=== TESSERACT FILES LISTED ===");
                            }, function(error) {
                                console.log("error: " + error);
                            });
                        }, function() {
                            console.log("Failed copying");
                        });
                    }, function(error) {
                        console.log("error: " + error);
                    });
                }, function(error) {
                    console.log("error: " + error);
                });
            });
        },

        bindEvents: function() {
            $('.tab-button').on('click', this.onTabClick);
            $('.back-button').on('click', function() {
                $('.back-button').toggleClass('active');
                controller.renderReportView();
            });
            $('.settings-back-button').on('click', function() {
                $('.settings-back-button').toggleClass('active');
                controller.renderSettingsView();
            });
            $('#mandolapp-menu').on("click", "a", null, function() {
                $('#mandolapp-menu').collapse('hide');
            });
        },

        onTabClick: function(e) {
            e.preventDefault();
            if ($(this).hasClass('active')) {
                return;
            }

            var tab = $(this).data('tab');
            switch (tab) {
                case "#home-tab":
                    self.renderHomeView();
                    break;
                case "#settings-tab":
                    self.renderSettingsView();
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
                    console.log("Error in rendering view.");
            }
        },

        renderLoadingView: function() {
            var $container = $('.main-container');
            $container.empty();

            $(".main-container").load("./views/loading.html", function(data) {

            });
        },

        renderReportInfo: function(e) {
            var $container = $('.main-container');
            $('.settings-back-button').removeClass('active');
            $('.back-button').addClass('active');
            $('.report-url-button').addClass('active');
            $container.empty();
            $(".main-container").load("./views/info.html", function(data) {
              var reportItem = $(e.target);
              $('.report-url-button').on('click', function(e){
                console.log("=== OPENING " + reportItem.attr('data-url') + " ===");
              });
            });
        },

        renderHatespeechView: function() {
            $('.tab-button').removeClass('active');
            $('.settings-back-button').removeClass('active');
            $('.back-button').removeClass('active');
            $('.report-url-button').removeClass('active');
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
                    axisX: {
                        showGrid: false,
                        showLabel: false
                    },
                    axisY: {
                        showGrid: false,
                        showLabel: false
                    }
                }
                new Chartist.Line('.olympic-chart.ct-chart', olympicsData, options);
                new Chartist.Line('.election-chart.ct-chart', electionsData, options);

                window.sr = ScrollReveal({
                    duration: 600
                });
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

                function number_format(number, decimals, dec_point, thousands_sep) {
                    var n = !isFinite(+number) ? 0 : +number,
                        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
                        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
                        toFixedFix = function(n, prec) {
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
                        $('.hatespeech-count').each(function() {
                            var $this = $(this);
                            jQuery({
                                Counter: 0
                            }).animate({
                                Counter: 1500000
                            }, {
                                duration: 1000,
                                easing: 'swing',
                                step: function() {
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
            $('.settings-back-button').removeClass('active');
            $('.report-url-button').removeClass('active');
            $('.back-button').removeClass('active');
            var $container = $('.main-container');
            $container.empty();

            MANDOLA_PROXY_PREFIX = "http://mandola.grid.ucy.ac.cy:9080/";

            $(".main-container").load("./views/report.html", function(data) {
                $(".report-item").on("click", controller.renderReportInfo);

                function generateFavicon(URL) {
                    return URL.replace(/^(http:\/\/[^\/]+).*$/, '$1') + '/favicon.ico';
                }

                function imageExists(url, callback) {
                  var img = new Image();
                  img.onload = function() { callback(true); };
                  img.onerror = function() { callback(false); };
                  img.src = url;
                }

                $('.report-item').each(function(index, value){
                  var url = $(value).attr('data-url');
                  var favicon = generateFavicon(url);
                  var reportIcon = $(value).find('.source-icon');
                  var reportFavicon = $(reportIcon).find('.report-favicon');
                  $(reportFavicon).attr('src', favicon);
                  console.log("FAVICON: " + favicon);

                  imageExists(favicon, function(value) {
                    console.log("=== FAVICON STATUS: " + value + " ===");
                    if(value){
                      $(reportIcon).html('<img src="' + favicon +'" class="source-icon" alt="">');
                    }
                  });
                });

                $("#browser-btn").on("click", function(e) {
                    swal({
                        title: 'Enter a URL to annotate',
                        input: 'text',
                        showCancelButton: true,
                        confirmButtonText: 'Load',
                        showLoaderOnConfirm: false,
                        preConfirm: function(mandolaURL) {
                            return new Promise(function(resolve, reject) {
                                var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                                if (!regexp.test(mandolaURL) || mandolaURL === "") {
                                    reject('Please provide a valid URL.');
                                } else {
                                    resolve();
                                }
                            });
                        },
                        allowOutsideClick: true
                    }).then(function(mandolaURL) {
                        controller.renderLoadingView();
                        inAppBrowser = cordova.InAppBrowser.open(MANDOLA_PROXY_PREFIX + mandolaURL, '_blank', 'hidden=yes, location=yes, toolbar=no, zoom=no');
                        inAppBrowser.addEventListener('loaderror', function(e) {
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
                            inAppBrowser.executeScript({
                                code: "localStorage.setItem('MAO', '" + JSON.stringify(MAO) + "');"
                            });
                            MAOObserver = setInterval(function() {
                                inAppBrowser.executeScript({
                                    code: "localStorage.getItem('MAO')"
                                }, function(values) {
                                    if (values[0]) {
                                        var tempMAO = JSON.parse(values[0]);
                                        if (tempMAO.updated != MAODate) {
                                            MAO = tempMAO;
                                        }
                                    } else {
                                        console.log("MANDOLA Application Object not found.");
                                    }
                                });
                            }, 100);
                            controller.renderReportView();
                            inAppBrowser.show();
                        });
                        inAppBrowser.addEventListener('exit', function() {
                            console.log(MAO);
                            delete MAO;
                            clearInterval(MAOObserver);
                            localStorage.clear();
                        });
                    }).catch(swal.noop);

                });

                window.sr = ScrollReveal({
                    duration: 300
                });
                sr.reveal('.report-item', {
                    origin: 'bottom',
                    duration: 300
                });

                function onPhotoURISuccess(imageURI) {
                    console.log("=== ON PHOTO URI ===");
                    console.log(imageURI);
                    plugins.crop.promise(imageURI, {
                        quality: 100
                    }).then(function success(newPath) {
                        console.log("=== CROP WAS SUCCESSFUL ===");

                        var newLangPath = cordova.file.dataDirectory + "files/";
                        var lang = controller.user_settings.default_language_code;

                        console.log("============================================");
                        console.log("IMAGE PATH: " + newPath);
                        console.log("LANGUAGE PATH: " + newLangPath);
                        console.log("LANGUAGE: " + lang);
                        console.log("============================================");

                        window.resolveLocalFileSystemURL(newPath,
                            function(fileEntry) {
                                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                                    function(fileSystem) {
                                        fileSystem.root.getDirectory('mandola', {
                                                create: true,
                                                exclusive: false
                                            },
                                            function(dataDir) {
                                                fileEntry.moveTo(dataDir, Date.now() + "-cropped.jpg", function(entry) {
                                                    console.log(entry);

                                                    tesseract_plugin.createEvent(entry.nativeURL, newLangPath, lang, function(result) {
                                                        console.log("=== TESSERACT WORKED ===");

                                                        swal.setDefaults({
                                                          input: 'text',
                                                          confirmButtonText: 'Next',
                                                          showCancelButton: true,
                                                          animation: true,
                                                          progressSteps: ['1', '2', '3', '4']
                                                        })

                                                        var steps = [
                                                          {
                                                            title: 'MANDOLA Report',
                                                            text: 'Confirm OCR text',
                                                            input: 'textarea',
                                                            inputValue: result,
                                                            allowOutsideClick: false,
                                                            preConfirm: function (text) {
                                                              return new Promise(function (resolve, reject) {
                                                                if(!text || text == ""){
                                                                  reject('Report text must not be empty');
                                                                }else{
                                                                  resolve();
                                                                }
                                                              })
                                                            }
                                                          },
                                                          {
                                                            title: 'Report title',
                                                            text: 'Type a title describing the report',
                                                            input: 'text',
                                                            allowOutsideClick: false,
                                                            preConfirm: function (title) {
                                                              return new Promise(function (resolve, reject) {
                                                                if(!title || title == ""){
                                                                  reject('Report title must be defined');
                                                                }else{
                                                                  resolve();
                                                                }
                                                              })
                                                            }
                                                          },
                                                          {
                                                            title: 'Source URL',
                                                            text: 'Type the source URL',
                                                            input: 'text',
                                                            allowOutsideClick: false,
                                                            preConfirm: function (url) {
                                                              return new Promise(function (resolve, reject) {
                                                                var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                                                                if (!regexp.test(url) || url === "") {
                                                                    reject('Please provide a valid URL.');
                                                                } else {
                                                                    resolve();
                                                                }
                                                              })
                                                            }
                                                          },
                                                          {
                                                            title: 'Categories',
                                                            text: 'Select hate categories',
                                                            preConfirm: function(categories) {
                                                              return new Promise(function (resolve, reject) {
                                                                if (categories === "" || categories === "") {
                                                                    reject('Please provide a valid URL.');
                                                                } else {
                                                                    resolve();
                                                                }
                                                              })
                                                            },
                                                            onOpen: function(){
                                                              $('#report-tags').on('change', function(e){
                                                                var hatestring = "";
                                                                document.querySelectorAll(".dropdown-menu.inner .selected").forEach(function(element, index, array) {
                                                                    if (index === 0) {
                                                                        hatestring = element.textContent;
                                                                    } else {
                                                                        hatestring += ", " + element.textContent;
                                                                    }
                                                                });
                                                                $('#redirect-hate-categories').val(hatestring);
                                                              });

                                                              $('.selectpicker').selectpicker({
                                                                style: 'btn-default',
                                                                size: 12
                                                              });
                                                            },
                                                            inputClass: 'hidden',
                                                            inputAttributes: {
                                                              'id': 'redirect-hate-categories'
                                                            },
                                                            html: '<select class="selectpicker form-control" required id="report-tags" name="report-tags" multiple required title="Choose from the following...">' +
                                                                      '<option>Religious</option>' +
                                                                      '<option>Gender</option>' +
                                                                      '<option>Sexual</option>' +
                                                                      '<option>Class</option>' +
                                                                      '<option>Politics</option>' +
                                                                      '<option>Ethnicity</option>' +
                                                                      '<option>Nationality</option>' +
                                                                      '<option>Other</option>' +
                                                                    '</select>',
                                                            allowOutsideClick: false
                                                          }
                                                        ]

                                                        swal.queue(steps).then(function (result) {
                                                          console.log(result);
                                                          var MAO = {
                                                            "title": title,
                                                            "timestamp": new Date(),
                                                            "url": document.querySelector('link[rel="canonical"]').getAttribute("href"),
                                                            "text": text,
                                                            "serialized": serialized,
                                                            "categories": categories
                                                          };

                                                          swal.resetDefaults();
                                                          swal({
                                                            title: 'Thank you!',
                                                            type: 'success',
                                                            html:
                                                              'Your report has been submitted. You will be notified for the results.',
                                                            confirmButtonText: 'OK',
                                                            showCancelButton: false
                                                          });
                                                        }, function () {
                                                          swal.resetDefaults();
                                                        });

                                                    }, function(error) {
                                                        console.log("=== TESSERACT FAILED ===");
                                                        console.log(error);
                                                    });
                                                }, function fail(err) {
                                                    console.log(err);
                                                });
                                            },
                                            function fail(err) {
                                                console.log(err);
                                            });
                                    },
                                    function fail(err) {
                                        console.log(err);
                                    });
                            }
                        );
                    }).catch(function fail(err) {
                        console.log(err);
                    });
                }

                $("#image-btn").on("click", function(e) {
                    if (controller.installed_languages.length == 0) {
                        swal({
                            title: 'No OCR languages found',
                            text: "You will have to download a language in order to use this functionality.",
                            type: 'error',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#CFCFCF',
                            confirmButtonText: 'Download'
                        }).then(function() {
                            controller.renderLanguagesView();
                        }).catch(swal.noop);
                    } else if (controller.user_settings.default_language_code == "none") {
                        swal({
                            title: 'No default OCR language selected',
                            text: "You will have to set a default language in order to use this functionality.",
                            type: 'error',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#CFCFCF',
                            confirmButtonText: 'Set default'
                        }).then(function() {
                            controller.renderSettingsView();
                        }).catch(swal.noop);
                    } else {
                        navigator.camera.getPicture(onPhotoURISuccess, function(error) {
                            console.log(error);
                        }, {
                            quality: 100,
                            allowEdit: false,
                            destinationType: Camera.DestinationType.FILE_URI,
                            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
                        });
                    }
                });

                function inflateBubble() {
                    cordovafloatingactivity.startFloatingActivity('screenshot-btn',
                        function() {
                            cordova.plugins.backgroundMode.setDefaults({
                                text: 'Still hunting for hatespeech.'
                            });
                            cordova.plugins.backgroundMode.enable();
                            console.log("Reporting bubble activated.");
                        },
                        function() {
                            console.log("Error in activating reporting bubble.");
                        }
                    );
                    cordovafloatingactivity.onFloatPressed('screenshot-btn',
                        function() {
                            console.log("Success in firing onFloatPressed.");
                            navigator.screenshot.URI(function(error, res) {
                                if (error) {
                                    console.error(error);
                                } else {
                                    html = '<img style="width:100%;" class="hatespeech-encounter-img" src="' + res.URI + '">';
                                    document.body.innerHTML = html;
                                    console.log(res);
                                }
                            }, 50);
                        },
                        function() {
                            console.log("Error in onFloatPressed.");
                        }
                    );
                }

                function requestPermission() {
                    cordova.plugins.diagnostic.requestRuntimePermission(
                        function(status) {
                            switch (status) {
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
                        },
                        function(error) {
                            console.error("The following error occurred: " + error);
                        },
                        cordova.plugins.diagnostic.runtimePermission.WRITE_EXTERNAL_STORAGE
                    );
                }

                $("#observe-btn").on("click", function(e) {
                    cordova.plugins.diagnostic.getPermissionAuthorizationStatus(
                        function(status) {
                            switch (status) {
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
                        },
                        function(error) {
                            console.error("The following error occurred: " + error);
                        },
                        cordova.plugins.diagnostic.runtimePermission.WRITE_EXTERNAL_STORAGE
                    );

                });

                $('.menu-button').on('click', function() {
                    $('.menu-button').toggleClass('pressed');
                });

            });

        },

        renderFAQsView: function() {
            $('.tab-button').removeClass('active');
            $('.settings-back-button').removeClass('active');
            $('.back-button').removeClass('active');
            $('.report-url-button').removeClass('active');
            $('#faqs-btn').addClass('active');

            var $container = $('.main-container');
            $container.empty();

            $(".main-container").load("./views/faqs.html", function(data) {
                $('.ui.accordion').accordion();
                faqsList = $('.faqs-list').html();

                var filterInput = document.getElementsByClassName('filter-input')[0];

                filterInput.addEventListener('input', function(e) {
                    var query = document.getElementsByClassName('filter-input')[0].value.trim().toLowerCase();

                    $('.faqs-list').html(faqsList);

                    if (query.length > 0) {
                        var titleFlag = false;
                        var queryResults = "";
                        $.each($('.faqs-list li'), function(index, value) {
                            if (($(value).hasClass("title") && $(value).text().trim().toLowerCase().includes(query)) || titleFlag) {
                                if ($(value).hasClass("title")) {
                                    queryResults += $(value).wrap("<li class='title'></li>").parent().html();
                                } else {
                                    queryResults += $(value).wrap("<li class='content'></li>").parent().html();
                                }
                                titleFlag = !titleFlag;
                            }
                        });
                    } else {
                        var queryResults = faqsList;
                    }

                    if (queryResults.length == 0) {
                        $('.faqs-list').html("<div class='no-results'>No results found.</div>");
                    } else {
                        $('.faqs-list').html(queryResults);
                    }

                });

                window.sr = ScrollReveal({
                    duration: 800
                });
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
        },

        renderSettingsView: function() {
            $('.tab-button').removeClass('active');
            $('#settings-btn').addClass('active');
            $('.report-url-button').removeClass('active');
            $('.settings-back-button').removeClass('active');
            $('.back-button').removeClass('active');

            var $container = $('.main-container');
            $container.empty();

            $(".main-container").load("./views/settings.html", function(data) {
                var installedOptions = {
                    'none': 'None'
                };
                for (i = 0; i < self.all_languages.length; i++) {
                    for (j = 0; j < self.installed_languages.length; j++) {
                        if (self.all_languages[i].code == self.installed_languages[j]) {
                            installedOptions[self.all_languages[i].code] = self.all_languages[i].text;
                            j = self.installed_languages.length;
                        }
                    }
                }

                $('#default-ocr-language .preview').text(controller.user_settings.default_language);
                if (controller.user_settings.hatespeech_analysis) {
                    console.log("=== ANALYSIS IS ON ===");
                    $("#mandola-analysis-checkbox")[0].checked = true;
                    $("#mandola-analysis-checkbox").parent().addClass('active');
                } else {
                    console.log("=== ANALYSIS IS OFF ===");
                    $("#mandola-analysis-checkbox")[0].checked = false;
                    $("#mandola-analysis-checkbox").parent().removeClass('active');
                }
                if (controller.user_settings.keep_cropped) {
                    console.log("=== KEEP IMAGES IS ON ===");
                    $("#keep-cropped-checkbox")[0].checked = true;
                    $("#keep-cropped-checkbox").parent().addClass('active');
                } else {
                    console.log("=== KEEP IMAGES IS OFF ===");
                    $("#keep-cropped-checkbox")[0].checked = false;
                    $("#keep-cropped-checkbox").parent().removeClass('active');
                }

                window.sr = ScrollReveal({
                    duration: 300
                });
                sr.reveal('.settings-item', {
                    origin: 'bottom',
                    duration: 300
                });

                $('#default-ocr-language').on('click', function() {
                    if (controller.installed_languages.length >= 0) {
                        swal({
                            title: 'Select the default language',
                            input: 'select',
                            inputOptions: installedOptions,
                            inputValue: controller.user_settings.default_language_code,
                            inputPlaceholder: 'Select language',
                            inputAttributes: {
                              'data-role':"none",
                              'id': 'default-language-selectbox'
                            },
                            showCancelButton: true,
                            onOpen: function(){
                              $('.default-language-selectbox').selectpicker({
                                style: 'btn-default',
                                size: 12
                              });
                              $('#default-language-selectbox').addClass('hidden');
                            },
                            inputClass: 'default-language-selectbox',
                            inputValidator: function(value) {
                                return new Promise(function(resolve, reject) {
                                    if (value) {
                                        resolve()
                                    } else {
                                        reject('You have to select a language.')
                                    }
                                })
                            }
                        }).then(function(result) {
                            controller.user_settings.default_language_code = result;
                            controller.user_settings.default_language = installedOptions[result];
                            $('#default-ocr-language .preview').text(controller.user_settings.default_language);
                            swal({
                                type: 'success',
                                html: installedOptions[result] + " is now the default language."
                            })
                        }).catch(swal.noop);
                    } else {
                        swal({
                            title: 'No languages found',
                            text: "You will have to download a language in order to use it.",
                            type: 'error',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#CFCFCF',
                            confirmButtonText: 'Download'
                        }).then(function() {
                            controller.renderLanguagesView();
                        }).catch(swal.noop);
                    }

                });

                $('#ocr-languages').on('click', function() {
                    self.renderLanguagesView();
                });

                $('#mandola-analysis-checkbox').click(function() {
                    var mainParent = $(this).parent('.toggle-btn');
                    if ($(mainParent).find('input.cb-value').is(':checked')) {
                        $(mainParent).addClass('active');
                        controller.user_settings.hatespeech_analysis = true;
                    } else {
                        $(mainParent).removeClass('active');
                        controller.user_settings.hatespeech_analysis = false;
                    }
                });

                $('#keep-cropped-checkbox').click(function() {
                    var mainParent = $(this).parent('.toggle-btn');
                    if ($(mainParent).find('input.cb-value').is(':checked')) {
                        $(mainParent).addClass('active');
                        controller.user_settings.keep_cropped = true;
                    } else {
                        $(mainParent).removeClass('active');
                        controller.user_settings.keep_cropped = false;
                    }
                });
            });
        },

        renderLanguagesView: function() {
            $('.tab-button').removeClass('active');
            $('.settings-back-button').addClass('active');
            $('.back-button').removeClass('active');
            $('.report-url-button').removeClass('active');
            $('#settings-btn').addClass('active');

            var $container = $('.main-container');
            $container.empty();

            $(".main-container").load("./views/languages.html", function(data) {
                for (i = 0; i < self.all_languages.length; i++) {
                    var flag = true;

                    for (j = 0; j < self.installed_languages.length; j++) {
                        if (self.all_languages[i].code == self.installed_languages[j]) {
                            $("#lang-ul").prepend('\
                    <li id="' + self.all_languages[i].code + '" class="delete-gradient"> \
                      <span class="lang-text">' + self.all_languages[i].text + '<span> \
                      <span class="lang-install-text">installed</span> \
                      <div class="delete-icon install-icon lang-top lang-right"></div> \
                    </li>');

                            j = self.installed_languages.length;
                            flag = false;
                        }
                    }

                    if (flag) {
                        $("#lang-ul").append('\
                  <li id="' + self.all_languages[i].code + '" class="download-gradient"> \
                    <span class="lang-text">' + self.all_languages[i].text + '<span> \
                    <span class="lang-install-text">not installed</span> \
                    <div class="download-icon install-icon lang-top lang-right"></div> \
                  </li>');
                    }
                }

                $("#lang-ul li").on("click", function() {
                    var lang = this.id;
                    var text = $("#" + lang + " .lang-install-text").text();

                    if (text == "installed") {
                        console.log("=== DELETING " + lang.toUpperCase() + " ===");
                        deleteLang(lang);
                    } else if (text == "not installed") {
                        console.log("=== DOWNLOADING " + lang.toUpperCase() + " ===");
                        downloadLang(lang);
                    }
                });

                window.sr = ScrollReveal({
                    duration: 300
                });
                sr.reveal('#lang-ul li', {
                    origin: 'bottom',
                    duration: 300
                });

                function deleteLang(lang) {

                    swal({
                        title: 'Are you sure?',
                        text: "You will have to download it in order to use it.",
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#CFCFCF',
                        confirmButtonText: 'Yes!'
                    }).then(function() {

                        var path = cordova.file.dataDirectory + "files/tessdata/";
                        window.resolveLocalFileSystemURL(path, function(dir) {
                            dir.getFile(lang + ".traineddata", {
                                create: false
                            }, function(fileEntry) {
                                fileEntry.remove(function(file) {

                                    $("#" + lang + " .lang-install-text").text("not installed");
                                    $("#" + lang).toggleClass('download-gradient delete-gradient');
                                    $("#" + lang + " .install-icon").toggleClass('download-icon delete-icon');

                                    for (var i = self.installed_languages.length - 1; i >= 0; i--) {
                                        if (self.installed_languages[i] === lang) {
                                            self.installed_languages.splice(i, 1);
                                            break;
                                        }
                                    }
                                }, function() {
                                    swal(
                                        'Oops..',
                                        'Could not deleted language data.',
                                        'error'
                                    )
                                }, function() {
                                    swal(
                                        'Deleted!',
                                        'The language data has been deleted.',
                                        'success'
                                    );
                                });
                            });
                        });
                    });

                }

                function downloadLang(lang) {
                    swal({
                        title: 'Want to use this language?',
                        text: "You will have to download it first.",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#CFCFCF',
                        confirmButtonText: 'Download'
                    }).then(function() {
                        var fileTransfer = new FileTransfer();
                        var fileURL = cordova.file.dataDirectory + "files/tessdata/" + lang + ".traineddata";
                        var uri = encodeURI("https://github.com/tesseract-ocr/tessdata/raw/master/" + lang + ".traineddata");

                        swal({
                            title: 'Please wait',
                            html: '<div>The language data is being downloaded.</div><br><div id="language-download-bar" class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div>',
                            animation: false,
                            showCancelButton: false,
                            showConfirmButton: false,
                            customClass: '',
                            allowOutsideClick: false,
                            confirmButtonClass: 'loading-download-bar-btn'
                        });

                        fileTransfer.onprogress = function(progressEvent) {
                            if (progressEvent.lengthComputable) {
                                var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                                $("#language-download-bar .progress-bar").attr('aria-valuenow', perc);
                                $("#language-download-bar .progress-bar").css('width', perc + "%");
                            } else {
                                swal.enableLoading();
                            }
                        };

                        fileTransfer.download(uri, fileURL, function(entry) {
                            $("#" + lang + " .lang-install-text").text("");
                            $("#" + lang + " .lang-install-text").text("installed");
                            $("#" + lang).toggleClass('delete-gradient download-gradient');
                            $("#" + lang + " .install-icon").toggleClass('delete-icon download-icon');
                            $('.loading-download-bar-btn').trigger("click");
                            self.installed_languages.push(lang);
                        }, function(error) {
                            $('.loading-download-bar-btn').trigger("click");
                            swal(
                                'Oops..',
                                'Could not download language data.',
                                'error'
                            );
                        }, false, {

                        });
                    });

                }
            });
        }

    }

    controller.initialize();
    return controller;
}
