cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "id": "cordova-plugin-image-picker.ImagePicker",
        "file": "plugins/cordova-plugin-image-picker/www/imagepicker.js",
        "pluginId": "cordova-plugin-image-picker",
        "clobbers": [
            "plugins.imagePicker"
        ]
    },
    {
        "id": "cordova-plugin-crop.CropPlugin",
        "file": "plugins/cordova-plugin-crop/www/crop.js",
        "pluginId": "cordova-plugin-crop",
        "clobbers": [
            "plugins.crop"
        ]
    },
    {
        "id": "cordova-sqlite-storage.SQLitePlugin",
        "file": "plugins/cordova-sqlite-storage/www/SQLitePlugin.js",
        "pluginId": "cordova-sqlite-storage",
        "clobbers": [
            "SQLitePlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.0",
    "cordova-plugin-console": "1.0.5-dev",
    "cordova-plugin-crosswalk-webview": "2.2.0",
    "cordova-plugin-inappbrowser": "1.6.0-dev",
    "cordova-plugin-image-picker": "1.1.1",
    "cordova-plugin-crop": "0.3.1",
    "cordova-sqlite-storage": "1.5.1"
};
// BOTTOM OF METADATA
});