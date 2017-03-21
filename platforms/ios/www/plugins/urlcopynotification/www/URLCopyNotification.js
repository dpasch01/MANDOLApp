cordova.define("urlcopynotification.URLCopyNotification", function(require, exports, module) {
var exec = require('cordova/exec');

exports.startURLCopyMonitoring = function(arg0, success, error) {
    exec(success, error, "URLCopyNotification", "startURLCopyMonitoring", [arg0]);
};

exports.onNotificationReceived = function(arg0, success, error) {
    exec(success, error, "URLCopyNotification", "onNotificationReceived", [arg0]);
};

exports.cancelURLCopyMonitoring = function(arg0, success, error) {
    exec(success, error, "URLCopyNotification", "cancelURLCopyMonitoring", [arg0]);
};

});
