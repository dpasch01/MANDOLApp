/*
This is the index.js, the main utility javascript file with code outside the scope of the
controller. It initializes the app and when the device is ready, creates the main controller. Also
overrides the browser native functionalities with the ones of the mobile device.
*/

var controller;
var app = {

    initialize: function() {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            document.addEventListener("deviceready", this.onDeviceReady, false);
        } else {
            this.onDeviceReady();
        }
    },

    onDeviceReady: function() {
        controller = new Controller();
        app.overrideBrowserAlert();
    },

    overrideBrowserAlert: function() {
        if (navigator.notification) {
            window.alert = function (message) {
                navigator.notification.alert(
                    message,
                    null,
                    "MandolApp",
                    'OK'
                );
            };
        }
    },

};

app.initialize();
