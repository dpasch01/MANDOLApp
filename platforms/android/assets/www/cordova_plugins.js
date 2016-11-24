cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "com.darktalker.cordova.screenshot.screenshot",
        "file": "plugins/com.darktalker.cordova.screenshot/www/Screenshot.js",
        "pluginId": "com.darktalker.cordova.screenshot",
        "merges": [
            "navigator.screenshot"
        ]
    },
    {
        "id": "cordova-plugin-camera.Camera",
        "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "id": "cordova-plugin-camera.CameraPopoverOptions",
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "id": "cordova-plugin-camera.camera",
        "file": "plugins/cordova-plugin-camera/www/Camera.js",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "id": "cordova-plugin-camera.CameraPopoverHandle",
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverHandle.js",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "CameraPopoverHandle"
        ]
    },
    {
        "id": "cordova-plugin-themeablebrowser.themeablebrowser",
        "file": "plugins/cordova-plugin-themeablebrowser/www/themeablebrowser.js",
        "pluginId": "cordova-plugin-themeablebrowser",
        "clobbers": [
            "cordova.ThemeableBrowser"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.0",
    "cordova-plugin-console": "1.0.5-dev",
    "com.darktalker.cordova.screenshot": "0.1.5",
    "cordova-plugin-compat": "1.1.0",
    "cordova-plugin-camera": "2.3.0",
    "cordova-plugin-crosswalk-webview": "2.1.0",
    "cordova-plugin-themeablebrowser": "0.2.17"
};
// BOTTOM OF METADATA
});