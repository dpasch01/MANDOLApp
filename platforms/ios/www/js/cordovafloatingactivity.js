
module.exports = {
    startFloatingActivity: function (name, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "cordovafloatingactivity", "startFloatingActivity", [name]);
    },
    onFloatPressed: function (name, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "cordovafloatingactivity", "onBubblePress", [name]);
    },
    stopFloatingActivity: function (name, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "cordovafloatingactivity", "stopFloatingActivity", [name]);
    }
};
