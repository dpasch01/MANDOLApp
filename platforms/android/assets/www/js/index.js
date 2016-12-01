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
