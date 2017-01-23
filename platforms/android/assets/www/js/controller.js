/*
This is the main application controller code. It holds all the necessery settings for the app to work and
renders all the views. It assigns the events to the navigation and parses the SQLite to present and write the
data. It also handles the reporting functionality through the browser and the tesseract ocr.
*/

var Controller = function() {

    var controller = {

        self: null,

        database: null,

        MANDOLA_PROXY_PREFIX: "http://mandola.grid.ucy.ac.cy:9080/",

        previousState: {
          states: [],
          depth: 0,
          load: function(){
            if(this.states.length > 0){
              var state = this.states[this.depth - 1];
              $(state.selector).replaceWith(state.state);
              this.depth = this.depth - 1;
              this.states.splice(this.depth - 1, 1);
            }else{
              console.log("=== NO PREVIOUS STATE HAS BEEN DEFINED ===");
            }
          },

          save: function(selector){
            this.states[this.depth] = {
              "selector": selector,
              "state": $(selector).clone(true)
            };
            this.depth = this.depth + 1;
          }
        },

        user_settings: {
            "default_language": 'None',
            "default_language_code": 'none',
            "keep_cropped": true,
            "hatespeech_analysis": false,
            "background_mandola": false
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
                "text": "Catalan - Valencian"
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
                "text": "Dutch - Flemish"
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
                "text": "Haitian - Haitian Creole"
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
                "text": "Kirghiz - Kyrgyz"
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
                "text": "Panjabi - Punjabi"
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
                "text": "Pushto - Pashto"
            },
            {
                "code": "ron",
                "text": "Romanian - Moldavian; Moldovan"
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
                "text": "Sinhala - Sinhalese"
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
                "text": "Spanish - Castilian"
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
                "text": "Uighur - Uyghur"
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

        request_runtime_permission: function() {
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

        setupView: function(enableURL, enableSettings, enableBack, enableEdit) {
            var $container = $('.main-container');

            if (enableURL) {
                $('.report-url-button').addClass('active');
            } else {
                $('.report-url-button').removeClass('active');
            }

            if (enableEdit) {
                $('.reports-edit-button').addClass('active');
            } else {
                $('.reports-edit-button').removeClass('active');
            }

            if (enableSettings) {
                $('.settings-back-button').addClass('active');
            } else {
                $('.settings-back-button').removeClass('active');
            }

            if (enableBack) {
                $('.back-button').addClass('active');
            } else {
                $('.back-button').removeClass('active');
            }

            $container.empty();
        },

        setupTesseract: function() {
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
                                    console.log("=== ERROR READING TESSERACT ENTRIES ===");
                                    console.log(error);
                                });
                                console.log("=== TESSERACT FILES LISTED ===");
                            }, function(error) {
                                console.log("=== ERROR READING TESSERACT FILESYSTEM ===");
                                console.log(error);
                            });
                        }, function(error) {
                            console.log("=== ERROR COPYING TESSERACT FILESYSTEM ===");
                            console.log(error);
                        });
                    }, function(error) {
                        console.log("=== ERROR REQUESTING TESSERACT FILESYSTEM ===");
                        console.log(error);
                    });
                }, function(error) {
                    console.log("=== ERROR RESOLVING TESSERACT FILESYSTEM ===");
                    console.log(error);
                });
            });
        },

        setupSQLite: function() {
            self.database = window.sqlitePlugin.openDatabase({
                name: "mandola.db",
                location: 'default'
            });

            self.database.transaction(function(transaction) {
                transaction.executeSql('CREATE TABLE IF NOT EXISTS mandola (id TEXT PRIMARY KEY, title TEXT, text TEXT, timestamp DATETIME, url TEXT, origin TEXT, serialized TEXT, categories TEXT)', [], function(tx, result) {
                    console.log("=== MANDOLA TABLE CREATED ===");
                }, function(error) {
                    console.log("=== MANDOLA TABLE CREATE ERROR ===");
                });
            });
        },

        initialize: function() {

            self = this;
            //Bind the navigation button events for the whole application.
            self.bindEvents();
            //Render the homescreen of the application, which is the report list.
            self.renderReportView();
            //Request WRITE_EXTERNAL_STORAGE runtime permission for the tesseract filesystem to be copied.
            self.request_runtime_permission();
            //Copy and setup tesseract filesystem for the optical character recognition functionality.
            self.setupTesseract();
            //Setup and instanciate the SQLite and mandola table for the application.
            self.setupSQLite();

            //If there are settings in applications localStorage, then load it in the application,
            //otherwise generate them by default and store them into the localStorage.
            if (localStorage.getItem('mandola_settings')) {
                console.log("=== MANDOLA SETTINGS FOUND ===");
                self.user_settings = JSON.parse(localStorage.getItem('mandola_settings'));
            } else {
                console.log("=== MANDOLA SETTINGS NOT FOUND ===");
                localStorage.setItem('mandola_settings', JSON.stringify(self.user_settings));
            }

            cordovafloatingactivity.onFloatPressed('mandola-btn',
                function(copied_url) {
                    navigator.app.resumeApp(true);
                    if (copied_url != "") {
                        console.log("=== COPIED URL " + copied_url.toUpperCase() + " ===");

                        swal({
                            title: '<div class="float-report-url">Report ' + copied_url + '</div>',
                            text: "How do you want to do this?",
                            type: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: '<i class="fa fa-eye" aria-hidden="true"></i>',
                            cancelButtonText: '<i class="fa fa-globe" aria-hidden="true"></i>',
                            confirmButtonClass: 'btn btn-success mandola-option',
                            cancelButtonClass: 'btn btn-success mandola-option'
                        }).then(function() {
                            console.log("=== GO WITH SCREENSHOT ===");
                            self.screenshotReport(copied_url);
                        }, function(dismiss) {
                            if (dismiss === 'cancel') {
                                console.log("=== GO WITH BROWSER ===");
                                self.browserReport(copied_url);
                            }
                        });

                    }
                    console.log("=== MANDOLA BUBBLE PRESSED ===");
                },
                function() {
                    console.log("=== MANDOLA BUBBLE PRESS FAILED ===");
                }
            );

            cordova.plugins.backgroundMode.setDefaults({
                text: 'You are still hunting for hatespeech.'
            });

            cordova.plugins.backgroundMode.onactivate = function() {
                console.log("=== MANDOLA BUBBLE ACTIVATED ===");
                self.mandolaBubble.start();
            }

            cordova.plugins.backgroundMode.ondeactivate = function() {
                console.log("=== MANDOLA BUBBLE DEACTIVATED ===");
                self.mandolaBubble.stop();
            };

            cordova.plugins.backgroundMode.onfailure = function(errorCode) {
                swal('Oops...', 'Could not enable MANDOLA bubble.', 'error');
            };

            if (self.user_settings.background_mandola) {
                cordova.plugins.backgroundMode.enable();
            }

        },

        bindEvents: function() {
            $('.tab-button').on('click', this.onTabClick);
            $('.back-button').on('click', function() {
                $('.back-button').toggleClass('active');
                controller.renderReportView();
            });
            $('.edit-back-button').on('click', function() {
                $('.edit-back-button').toggleClass('active');
                controller.previousState.load();
            });
            $('.settings-back-button').on('click', function() {
                $('.settings-back-button').toggleClass('active');
                controller.renderSettingsView();
            });
            $('.reports-edit-button').on('click', function() {
                $('.reports-edit-button').toggleClass('edit-mode');
                if ($('.reports-edit-button').hasClass('edit-mode')) {
                    self.enterEditMode();
                } else {
                    self.leaveEditMode();
                }

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
            var btn = $(this).attr('id');

            $('.tab-button').removeClass('active');
            $("#" + btn).addClass('active');

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

        mandolaLoading: {

            start: function() {
                $('.main-container').addClass('hidden');
                $('.loading-container').removeClass('hidden');
            },

            finish: function() {
                $('.loading-container').addClass('hidden');
                $('.main-container').removeClass('hidden');
            }

        },

        renderLoadingView: function() {
            self.setupView();
            $(".main-container").load("./views/loading.html", function(data) {});
        },

        openMandolaProxy: function(url, text, serialized) {
            console.log("=== OPENING MANDOLA PROXY " + url + " ===");
            var MANDOLA_KEY = "";
            if (serialized != null) {
                console.log("=== DESERIALIZING TEXT ===");
                MANDOLA_KEY="MANDOLA_SERIALIZED";
            } else {
                console.log("=== SEARCHING FOR TEXT ===");
                MANDOLA_KEY="MANDOLA_TEXT";
            }

            self.mandolaLoading.start();
            inAppBrowser = cordova.InAppBrowser.open(self.MANDOLA_PROXY_PREFIX + url, '_blank', 'hidden=yes, location=yes, toolbar=no, zoom=no');
            inAppBrowser.addEventListener('loaderror', function(e) {
                swal('Oops...', 'Could not load: ' + url, 'error');
                self.mandolaLoading.finish();
                inAppBrowser.close();
            });
            inAppBrowser.addEventListener('loadstop', function() {
                inAppBrowser.executeScript({
                    code: "localStorage.clear();"
                });
                inAppBrowser.executeScript({
                    code: "localStorage.setItem('" + MANDOLA_KEY + "', '" + escape(text) + "');"
                });
                inAppBrowser.show();
            });
            inAppBrowser.addEventListener('exit', function() {
                self.mandolaLoading.finish();
            });
        },

        renderReportInfo: function(reportItem) {

            self.setupView(true, false, true, false);

            $(".main-container").load("./views/info.html", function(data) {
                var title = "No title";
                if (reportItem.title != "") {
                    title = reportItem.title;
                }

                $('.info.container').attr('id', reportItem.id);

                $('.report-title').html(title);
                $('.report-date').html(moment(reportItem.timestamp).format('dddd, MMMM Do YYYY, HH:mm'));
                $('.report-content').html(reportItem.text);

                reportItem.categories.split(", ").forEach(function(element) {
                    $('.report-tags').append('<span class="tag label label-primary">' + element + '</span>');
                });

                $('.report-url-button').attr('data-url', reportItem.url);

                $('.report-url-button').on('click', function(e) {
                    console.log("=== OPENING " + reportItem.url.toUpperCase() + " ===");
                    self.openMandolaProxy(reportItem.url, reportItem.text, reportItem.serialized);
                });
            });
        },

        renderHatespeechView: function() {

            self.setupView(false, false, false, false);

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

        appendReport: function(reportObject) {
            var uri = new URI(reportObject.url);

            function truncate(n, useWordBoundary) {
                var isTooLong = this.length > n,
                    s_ = isTooLong ? this.substr(0, n - 1) : this;
                s_ = (useWordBoundary && isTooLong) ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
                return isTooLong ? s_ + '&hellip;' : s_;
            }

            self.database.transaction(function(transaction) {
                var executeQuery = "INSERT INTO mandola (id, title, text, timestamp, url, origin, serialized, categories) VALUES (?,?,?,?,?,?,?,?)";
                transaction.executeSql(executeQuery, [
                    device.uuid + reportObject.timestamp,
                    reportObject.title,
                    reportObject.text,
                    reportObject.timestamp,
                    reportObject.url,
                    uri.authority,
                    reportObject.serialized,
                    reportObject.categories.join(', ')
                ], function(tx, result) {
                    console.log("=== REPORT INSERTED IN SQLITE ===");

                    var title = "No title";
                    if (reportObject.title != "") {
                        title = reportObject.title;
                    }

                    $(".report-wrapper .list").prepend('<li id="' + device.uuid + "" + reportObject.timestamp + '" data-url="' + reportObject.url + '" class="report-item">' +
                        '<div class="source-icon">' +
                        '<i class="report-browser fa fa-3x fa-globe" aria-hidden="true"></i>' +
                        '</div>' +
                        '<div class="report-info">' +
                        '<div class="report-title">' + title + '</div>' +
                        '<div class="report-content">' + truncate.apply(reportObject.text, [35, false]) + '</div>' +
                        '<div class="report-date">' + moment(reportObject.timestamp).fromNow() + '</div>' +
                        '</div>' +
                        '</li>');

                    self.loadReport(device.uuid + "" + reportObject.timestamp);

                    $('#' + device.uuid + "" + reportObject.timestamp).addClass('animated');
                    $('#' + device.uuid + "" + reportObject.timestamp).addClass('bounceIn');

                }, function(error) {
                    console.log(error);
                    console.log("=== REPORT NOT INSERTED IN SQLITE ===");
                });
            });
        },

        mandolaBubble: {

            start: function() {
                cordovafloatingactivity.startFloatingActivity('mandola-btn',
                    function() {
                        console.log("=== MANDOLA BUBBLE ACTIVATED ===");
                    },
                    function() {
                        console.log("=== MANDOLA BUBBLE ACTIVATION FAILED ===");
                    }
                );
            },

            stop: function() {
                cordovafloatingactivity.stopFloatingActivity('mandola-btn',
                    function() {
                        console.log("=== MANDOLA BUBBLE DEACTIVATED ===");
                    },
                    function() {
                        console.log("=== MANDOLA BUBBLE DEACTIVATION FAILED ===");
                    }
                );

            }

        },

        browserReport: function(copied_url) {
            //If copied_url is not provided,
            //then initialize it with empty string.
            if (!copied_url) {
                copied_url = "";
            }

            swal({
                title: 'Enter a URL to annotate',
                input: 'text',
                inputValue: copied_url,
                focusCancel: true,
                showCancelButton: true,
                confirmButtonText: 'Load',
                showLoaderOnConfirm: false,
                preConfirm: function(mandolaURL) {
                    return new Promise(function(resolve, reject) {
                        //Check if the value passed is an actual url via regex.
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
                self.mandolaLoading.start();
                inAppBrowser = cordova.InAppBrowser.open(self.MANDOLA_PROXY_PREFIX + mandolaURL, '_blank', 'hidden=yes, location=yes, toolbar=no, zoom=no');
                inAppBrowser.addEventListener('loaderror', function(e) {
                    swal('Oops...', 'Could not load: ' + mandolaURL, 'error');
                    self.mandolaLoading.finish();
                    inAppBrowser.close();
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
                    inAppBrowser.show();
                });
                inAppBrowser.addEventListener('exit', function() {
                    self.mandolaLoading.finish();
                    MAO.reports.forEach(function(report) {
                        self.appendReport({
                            "title": report.title,
                            "timestamp": Date.now(),
                            "url": report.url,
                            "text": report.text,
                            "serialized": report.serialized,
                            "categories": report.categories
                        });
                    });
                    delete MAO;
                    clearInterval(MAOObserver);
                });
            }).catch(swal.noop);

        },

        screenshotReport: function(copied_url) {
            //If copied_url is not provided,
            //then initialize it with empty string.
            if (!copied_url) {
                copied_url = "";
            }

            if (self.installed_languages.length == 0) {
                swal({
                    title: 'No OCR languages found',
                    text: "You will have to download a language in order to use this functionality.",
                    type: 'error',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#CFCFCF',
                    confirmButtonText: 'Download'
                }).then(function() {
                    self.renderLanguagesView();
                }).catch(swal.noop);
            } else if (self.user_settings.default_language_code == "none") {
                swal({
                    title: 'No default OCR language selected',
                    text: "You will have to set a default language in order to use this functionality.",
                    type: 'error',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#CFCFCF',
                    confirmButtonText: 'Set default'
                }).then(function() {
                    self.renderSettingsView();
                }).catch(swal.noop);
            } else {
                navigator.camera.getPicture(function(uri) {
                    self.onPhotoURISuccess(uri, copied_url);
                }, function(error) {
                    console.log(error);
                }, {
                    quality: 100,
                    allowEdit: false,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
                });
            }
        },

        loadReport: function(reportID) {

            function generateFavicon(URL) {
                var uri = new URI(URL);
                return 'http://logo.clearbit.com/' + uri.authority;
            }

            function imageExists(url, callback) {
                $.ajax({
                    url: url,
                    type: 'get',
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        callback(false);
                    },
                    success: function(data) {
                        callback(true);
                    }
                });
            }

            var reportElement = "#" + reportID;

            $(reportElement).on("click", function(e) {
                var reportID = e.currentTarget.id;
                self.database.transaction(function(transaction) {
                    transaction.executeSql('SELECT * FROM mandola WHERE id=?', [reportID], function(tx, results) {
                        var len = results.rows.length;
                        if (len > 0) {
                            self.renderReportInfo(results.rows.item(0));
                        }
                    }, function(error) {
                        console.log("=== SQLITE COULDNT LOAD " + reportID.toUpperCase() + " ===");
                    });
                });
            });

            var url = $(reportElement).attr('data-url');
            var favicon = generateFavicon(url);
            var reportIcon = $(reportElement).find('.source-icon');
            var reportFavicon = $(reportIcon).find('.report-favicon');

            $(reportFavicon).attr('src', favicon);

            imageExists(favicon, function(value) {
                if (value) {
                    $(reportIcon).html('<img src="' + favicon + '" class="source-icon" alt="">');
                }
            });
        },

        onPhotoURISuccess: function(imageURI, copied_url) {
            //If copied_url is not provided,
            //then initialize it with empty string.
            if (!copied_url) {
                copied_url = "";
            }

            //Execute the crop promise of the given imageURI.
            //We want the best quality of the cropped image in order to do OCR
            //on the screenshot of the user.
            plugins.crop.promise(imageURI, {
                quality: 100
            }).then(function success(newPath) {
                self.mandolaLoading.start();

                //Setup tesseract's language files and
                //default user's OCR language code from settings.
                var newLangPath = cordova.file.dataDirectory + "files/";
                var lang = controller.user_settings.default_language_code;

                //Copy the cropped image in the application's main folder. If the
                //user settings on keeping the image is true then keep it.
                window.resolveLocalFileSystemURL(newPath,
                    function(fileEntry) {
                        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                            function(fileSystem) {
                                fileSystem.root.getDirectory('mandola', {
                                        create: true,
                                        exclusive: false
                                    },
                                    function(dataDir) {
                                        //Save the cropped image as <currentTimeInMiliseconds>-cropped.jpg
                                        //in the /mandola folder in /emulated/0/Android/data path.
                                        fileEntry.moveTo(dataDir, Date.now() + "-cropped.jpg", function(entry) {

                                            //Pass the cropped image in the tesseract plugin to do the OCR.
                                            tesseract_plugin.createEvent(entry.nativeURL, newLangPath, lang, function(result) {

                                                self.mandolaLoading.finish();
                                                //If tesseract succesfuly did the OCR then
                                                //begin the reporting flow using sweetalert2 queue.
                                                swal.setDefaults({
                                                    input: 'text',
                                                    confirmButtonText: 'Next',
                                                    showCancelButton: true,
                                                    animation: true,
                                                    progressSteps: ['1', '2', '3', '4']
                                                })

                                                var steps = [{
                                                        title: 'MANDOLA Report',
                                                        text: 'Confirm OCR text',
                                                        input: 'textarea',
                                                        focusCancel: true,
                                                        inputValue: result,
                                                        allowOutsideClick: false,
                                                        preConfirm: function(text) {
                                                            return new Promise(function(resolve, reject) {
                                                                if (!text || text == "") {
                                                                    reject('Report text must not be empty');
                                                                } else {
                                                                    resolve();
                                                                }
                                                            })
                                                        }
                                                    },
                                                    {
                                                        title: 'Report title',
                                                        text: 'Type a title describing the report if you want',
                                                        input: 'text',
                                                        focusCancel: true,
                                                        inputPlaceholder: 'e.g Hatespeech filled comment',
                                                        allowOutsideClick: false
                                                    },
                                                    {
                                                        title: 'Source URL',
                                                        text: 'Type the source URL',
                                                        input: 'text',
                                                        focusCancel: true,
                                                        inputValue: copied_url,
                                                        allowOutsideClick: false,
                                                        preConfirm: function(url) {
                                                            return new Promise(function(resolve, reject) {
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
                                                        focusCancel: true,
                                                        preConfirm: function(categories) {
                                                            return new Promise(function(resolve, reject) {
                                                                if (categories === "" || categories === "") {
                                                                    reject('Please provide a valid URL.');
                                                                } else {
                                                                    resolve();
                                                                }
                                                            })
                                                        },
                                                        onOpen: function() {
                                                            $('#report-tags').on('change', function(e) {
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

                                                swal.queue(steps).then(function(result) {
                                                    self.appendReport({
                                                        "title": result[1],
                                                        "timestamp": Date.now(),
                                                        "url": result[2],
                                                        "text": result[0],
                                                        "serialized": null,
                                                        "categories": result[3].split(", ")
                                                    });
                                                    swal.resetDefaults();
                                                }, function() {
                                                    swal.resetDefaults();
                                                });

                                                //If user define to delete cropped files, then
                                                //find the cropped image and delete it.
                                                if (!self.user_settings.keep_cropped) {
                                                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                                                        fileSystem.root.getFile(entry.fullPath, {
                                                            create: false
                                                        }, function(fileEntry) {
                                                            fileEntry.remove(function(file) {
                                                                console.log("=== FILE REMOVED ===");
                                                            }, function() {
                                                                console.log(error);
                                                            });
                                                        }, function() {
                                                            console.log("=== FILE DOES NOT EXIST ===");
                                                        });
                                                    }, function(error) {
                                                        console.log(error);
                                                    });
                                                }

                                            }, function(error) {
                                                self.mandolaLoading.finish();
                                                console.log(error);
                                            });
                                        }, function fail(err) {
                                            self.mandolaLoading.finish();
                                            console.log(err);
                                        });
                                    },
                                    function fail(err) {
                                        self.mandolaLoading.finish();
                                        console.log(err);
                                    });
                            },
                            function fail(err) {
                                self.mandolaLoading.finish();
                                console.log(err);
                            });
                    }
                );
            }).catch(function fail(err) {
                console.log(err);
            });
        },

        leaveEditMode: function() {
            console.log("=== LEAVING EDIT MODE ===");

            $('.report-action').toggleClass('hidden');
            $('.sort-action').toggleClass('hidden');

            $('.report-item').off();
            $('.report-item').on("click", function(e) {
                var reportID = e.currentTarget.id;
                console.log("=== SHOWING INFO ON " + reportID.toUpperCase() + " ===");
                self.database.transaction(function(transaction) {
                    transaction.executeSql('SELECT * FROM mandola WHERE id=?', [reportID], function(tx, results) {
                        var len = results.rows.length;
                        if (len > 0) {
                            self.renderReportInfo(results.rows.item(0));
                        }
                    }, function(error) {
                        console.log("=== SQLITE COULDNT LOAD " + reportID.toUpperCase() + " ===");
                    });
                });
            });
        },

        enterEditMode: function() {
            console.log("=== ENTERING EDIT MODE ===");

            $('.report-item').off();
            $('.report-item').on("click", function(e) {
                swal({
                    title: 'Are you sure?',
                    text: "This report will be deleted from your list.",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#CFCFCF',
                    confirmButtonText: 'Yes!'
                }).then(function() {
                    var reportID = e.currentTarget.id;
                    self.database.transaction(function(transaction) {
                        transaction.executeSql('DELETE FROM mandola WHERE id=?', [reportID], function(tx, results) {
                            $('#' + reportID).animateCSS('bounceOutLeft', function(){
                              $('#' + reportID).remove();
                            });
                            console.log("=== SQLITE DELETED " + reportID.toUpperCase() + " ===");
                        }, function(error) {
                            swal(
                                'Oops..',
                                'Could not delete the selected report.',
                                'error'
                            );
                            console.log("=== SQLITE COULDNT DELETE " + reportID.toUpperCase() + " ===");
                        });
                    });
                });

            });

            $('.report-action').toggleClass('hidden');
            $('.sort-action').toggleClass('hidden');
        },

        renderSortAscending: function(){

          function truncate(n, useWordBoundary) {
              var isTooLong = this.length > n,
                  s_ = isTooLong ? this.substr(0, n - 1) : this;
              s_ = (useWordBoundary && isTooLong) ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
              return isTooLong ? s_ + '&hellip;' : s_;
          }


          controller.previousState.save(".report-wrapper .list");
          $(".report-wrapper .list").html("");

          self.database.transaction(function(transaction) {
              transaction.executeSql('SELECT * FROM mandola ORDER BY timestamp DESC', [], function(tx, results) {

                  var len = results.rows.length;
                  var i;

                  for (i = 0; i < len; i++) {
                      var item = results.rows.item(i);

                      var title = "No title";
                      if (item.title != "") {
                          title = item.title;
                      }
                      $(".report-wrapper .list").append('<li id="' + item.id + '" data-url="' + item.url + '" class="report-item">' +
                          '<div class="source-icon">' +
                          '<i class="report-browser fa fa-3x fa-globe" aria-hidden="true"></i>' +
                          '</div>' +
                          '<div class="report-info">' +
                          '<div class="report-title">' + title + '</div>' +
                          '<div class="report-content">' + truncate.apply(item.text, [35, false]) + '</div>' +
                          '<div class="report-date">' + moment(item.timestamp).fromNow() + '</div>' +
                          '</div>' +
                          '</li>');
                      self.loadReport(item.id);
                  }

                  window.sr = ScrollReveal({
                      duration: 500
                  });
                  sr.reveal('.report-wrapper .list-view .list .report-item', {
                      origin: 'bottom',
                      duration: 500
                  });

              }, null);
          });
        },

        renderSortDescending: function(){

          function truncate(n, useWordBoundary) {
              var isTooLong = this.length > n,
                  s_ = isTooLong ? this.substr(0, n - 1) : this;
              s_ = (useWordBoundary && isTooLong) ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
              return isTooLong ? s_ + '&hellip;' : s_;
          }

          $(".report-wrapper .list").html("");

          self.database.transaction(function(transaction) {
              transaction.executeSql('SELECT * FROM mandola ORDER BY timestamp ASC', [], function(tx, results) {

                  $(".report-wrapper .list").html("");
                  var len = results.rows.length;
                  var i;

                  for (i = 0; i < len; i++) {
                      var item = results.rows.item(i);
                      console.log(item.timestamp);
                      var title = "No title";
                      if (item.title != "") {
                          title = item.title;
                      }
                      $(".report-wrapper .list").append('<li id="' + item.id + '" data-url="' + item.url + '" class="report-item">' +
                          '<div class="source-icon">' +
                          '<i class="report-browser fa fa-3x fa-globe" aria-hidden="true"></i>' +
                          '</div>' +
                          '<div class="report-info">' +
                          '<div class="report-title">' + title + '</div>' +
                          '<div class="report-content">' + truncate.apply(item.text, [35, false]) + '</div>' +
                          '<div class="report-date">' + moment(item.timestamp).fromNow() + '</div>' +
                          '</div>' +
                          '</li>');
                      self.loadReport(item.id);
                  }

                  window.sr = ScrollReveal({
                      duration: 500
                  });
                  sr.reveal('.report-wrapper .list-view .list .report-item', {
                      origin: 'bottom',
                      duration: 500
                  });

              }, null);
          });
        },

        renderSearchResults: function(search){

        function truncate(n, useWordBoundary) {
              var isTooLong = this.length > n,
                  s_ = isTooLong ? this.substr(0, n - 1) : this;
              s_ = (useWordBoundary && isTooLong) ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
              return isTooLong ? s_ + '&hellip;' : s_;
          }

          self.database.transaction(function(transaction) {
              transaction.executeSql("SELECT * FROM mandola WHERE mandola.text LIKE ('%" + search +"%') OR mandola.url LIKE ('%" + search +"%') OR mandola.title LIKE ('%" + search + "%') ORDER BY timestamp ASC", [], function(tx, results) {
                  if(self.previousState.states.length > 0 && results.rows.length > 0){
                    $('.edit-back-button').addClass('active');
                  }

                  controller.previousState.save(".report-wrapper .list");
                  $(".report-wrapper .list").html("");
                  var len = results.rows.length;
                  var i;

                  for (i = 0; i < len; i++) {
                      var item = results.rows.item(i);

                      var title = "No title";
                      if (item.title != "") {
                          title = item.title;
                      }
                      $(".report-wrapper .list").append('<li id="' + item.id + '" data-url="' + item.url + '" class="report-item">' +
                          '<div class="source-icon">' +
                          '<i class="report-browser fa fa-3x fa-globe" aria-hidden="true"></i>' +
                          '</div>' +
                          '<div class="report-info">' +
                          '<div class="report-title">' + title + '</div>' +
                          '<div class="report-content">' + truncate.apply(item.text, [35, false]) + '</div>' +
                          '<div class="report-date">' + moment(item.timestamp).fromNow() + '</div>' +
                          '</div>' +
                          '</li>');
                      self.loadReport(item.id);
                  }

                  window.sr = ScrollReveal({
                      duration: 500
                  });
                  sr.reveal('.report-wrapper .list-view .list .report-item', {
                      origin: 'bottom',
                      duration: 500
                  });

              }, function(error){
                console.log(error);
              });
          });

        },

        renderGroupByHost: function(){

          function truncate(n, useWordBoundary) {
              var isTooLong = this.length > n,
                  s_ = isTooLong ? this.substr(0, n - 1) : this;
              s_ = (useWordBoundary && isTooLong) ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
              return isTooLong ? s_ + '&hellip;' : s_;
          }

          self.database.transaction(function(transaction) {
              transaction.executeSql("SELECT origin, count(*) AS count FROM mandola GROUP BY origin ORDER BY origin ASC", [], function(tx, results) {
                  if(self.previousState.states.length > 0 && results.rows.length > 0){
                    $('.edit-back-button').addClass('active');
                  }

                  controller.previousState.save(".report-wrapper .list");
                  $(".report-wrapper .list").html("");

                  var len = results.rows.length;
                  var i;

                  for (i = 0; i < len; i++) {
                      var item = results.rows.item(i);
                      var itemCount = "0 items";

                      if(item.count == 1){
                        itemCount = "1 item"
                      }else{
                        itemCount = item.count + " items"
                      }

                      $(".report-wrapper .list").append('<li data-origin="' + item.origin + '" class="host-item">' +
                          '<div class="source-icon">' +
                          '<i class="report-browser fa fa-3x fa-globe" aria-hidden="true"></i>' +
                          '</div>' +
                          '<div class="host-info">' +
                          '<div class="host-name">' + item.origin + '</div>' +
                          '<div class="host-count">' + itemCount + '</div>' +
                          '</div>' +
                          '</li>');
                  }

                  $('.host-item').on("click", function(e) {
                    var url = $(e.currentTarget).attr('data-origin');
                    self.renderSearchResults(url);
                  });

                  $('.host-item').each(function(index, reportElement){
                    var url = $(reportElement).attr('data-origin');
                    var favicon = 'http://logo.clearbit.com/' + url;

                    $.ajax({
                        url: favicon,
                        type: 'get',
                        error: function(XMLHttpRequest, textStatus, errorThrown) {},
                        success: function(data) {
                            $(reportElement).find('.source-icon').html('<img src="' + favicon + '" class="source-icon" alt="">');
                        }
                    });

                  });

                  window.sr = ScrollReveal({
                      duration: 500
                  });
                  sr.reveal('.report-wrapper .list-view .list .host-item', {
                      origin: 'bottom',
                      duration: 500
                  });

              }, function(error){
                console.log(error);
              });
          });

        },

        renderReportView: function() {
            self.setupView(false, false, false, true);

            $(".main-container").load("./views/report.html", function(data) {

                window.sr = ScrollReveal({
                    duration: 500
                });
                sr.reveal('.report-wrapper .list-view .list', {
                    origin: 'bottom',
                    duration: 500
                });

                self.renderSortAscending();

                //The reporting functionality provides two options, via browser and via screenshot.
                //This here is the browser button which enables the browser reporting functionality.
                //The user is prompted to load an external url in order to open it in the inAppBrowser
                //via the mandola proxy.
                $("#browser-btn").on("click", function(e) {
                    self.browserReport();
                });

                //This is the screenshot button where the user will be prompted to
                //load a screenshot from within his gallery, and crop the space where
                //the text is to do an ocr on it. Then present the form based on that.
                $("#image-btn").on("click", function(e) {
                    self.screenshotReport();
                });

                $('.menu-button').on('click', function() {
                    $('.menu-button').toggleClass('pressed');
                });

                $("#report-sort-desc-btn").on("click", function(e) {
                  $('.sort-button').toggleClass('pressed');
                  self.renderSortDescending();
                });

                $("#report-sort-asc-btn").on("click", function(e) {
                  $('.sort-button').toggleClass('pressed');
                  self.renderSortAscending();
                });

                $("#report-search-btn").on("click", function(e) {
                  $('.sort-button').toggleClass('pressed');
                  swal({
                      type: 'question',
                      title: 'What do you want to search for?',
                      input: 'text',
                      showCancelButton: true,
                      confirmButtonText: '<i class="fa fa-search" aria-hidden="true"></i>',
                      showLoaderOnConfirm: false,
                      allowOutsideClick: true
                  }).then(function(searchKey) {
                      self.renderSearchResults(searchKey);
                  });
                });

                $("#report-group-by-host-btn").on("click", function(e) {
                  self.renderGroupByHost();
                  $('.sort-button').toggleClass('pressed');
                });

                $('.sort-button').on('click', function() {
                    $('.sort-button').toggleClass('pressed');
                });

            });

        },

        renderFAQsView: function() {

            self.setupView(false, false, false, false);

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

            self.setupView(false, false, false, false);

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

                $('#default-ocr-language .preview').text(self.user_settings.default_language);

                if (self.user_settings.hatespeech_analysis) {
                    console.log("=== ANALYSIS IS ON ===");
                    $("#mandola-analysis-checkbox")[0].checked = true;
                    $("#mandola-analysis-checkbox").parent().addClass('active');
                } else {
                    console.log("=== ANALYSIS IS OFF ===");
                    $("#mandola-analysis-checkbox")[0].checked = false;
                    $("#mandola-analysis-checkbox").parent().removeClass('active');
                }

                if (self.user_settings.keep_cropped) {
                    console.log("=== KEEP IMAGES IS ON ===");
                    $("#keep-cropped-checkbox")[0].checked = true;
                    $("#keep-cropped-checkbox").parent().addClass('active');
                } else {
                    console.log("=== KEEP IMAGES IS OFF ===");
                    $("#keep-cropped-checkbox")[0].checked = false;
                    $("#keep-cropped-checkbox").parent().removeClass('active');
                }

                if (self.user_settings.background_mandola) {
                    console.log("=== MANDOLA BACKGROUND IS ON ===");
                    $("#mandola-background")[0].checked = true;
                    $("#mandola-background").parent().addClass('active');
                } else {
                    console.log("=== MANDOLA BACKGROUND IS OFF ===");
                    $("#mandola-background")[0].checked = false;
                    $("#mandola-background").parent().removeClass('active');
                }

                window.sr = ScrollReveal({
                    duration: 300
                });
                sr.reveal('.settings-item', {
                    origin: 'bottom',
                    duration: 300
                });

                $('#default-ocr-language').on('click', function() {
                    if (self.installed_languages.length >= 0) {
                        swal({
                            title: 'Select the default language',
                            input: 'select',
                            inputOptions: installedOptions,
                            inputValue: self.user_settings.default_language_code,
                            inputPlaceholder: 'Select language',
                            inputAttributes: {
                                'id': 'default-language-selectbox'
                            },
                            showCancelButton: true,
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
                            self.user_settings.default_language_code = result;
                            self.user_settings.default_language = installedOptions[result];
                            localStorage.setItem('mandola_settings', JSON.stringify(self.user_settings));
                            $('#default-ocr-language .preview').text(self.user_settings.default_language);
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
                            self.renderLanguagesView();
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
                        self.user_settings.hatespeech_analysis = true;
                    } else {
                        $(mainParent).removeClass('active');
                        self.user_settings.hatespeech_analysis = false;
                    }
                    localStorage.setItem('mandola_settings', JSON.stringify(self.user_settings));
                });

                $('#keep-cropped-checkbox').click(function() {
                    var mainParent = $(this).parent('.toggle-btn');
                    if ($(mainParent).find('input.cb-value').is(':checked')) {
                        $(mainParent).addClass('active');
                        self.user_settings.keep_cropped = true;
                    } else {
                        $(mainParent).removeClass('active');
                        self.user_settings.keep_cropped = false;
                    }
                    localStorage.setItem('mandola_settings', JSON.stringify(self.user_settings));
                });

                $('#mandola-background').click(function() {
                    var mainParent = $(this).parent('.toggle-btn');
                    if ($(mainParent).find('input.cb-value').is(':checked')) {
                        $(mainParent).addClass('active');
                        self.user_settings.background_mandola = true;
                        cordova.plugins.backgroundMode.enable();
                    } else {
                        $(mainParent).removeClass('active');
                        self.user_settings.background_mandola = false;
                        cordova.plugins.backgroundMode.disable();
                    }
                    localStorage.setItem('mandola_settings', JSON.stringify(self.user_settings));
                });
            });
        },

        renderLanguagesView: function() {

            self.setupView(false, true, false, false);

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

                                    if (self.user_settings.default_language_code == lang) {
                                        self.user_settings.default_language = "None";
                                        self.user_settings.default_language_code = "none";
                                    }
                                }, function() {
                                    swal(
                                        'Oops..',
                                        'Could not deleted language data.',
                                        'error'
                                    )
                                }, function() {

                                });
                            });
                        });
                    }).catch(swal.noop);

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
                            $("#language-download-bar .progress-bar").attr('aria-valuenow', "100");
                            $("#language-download-bar .progress-bar").css('width', "100%");
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
