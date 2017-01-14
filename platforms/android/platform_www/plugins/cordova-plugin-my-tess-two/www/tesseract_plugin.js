cordova.define("cordova-plugin-my-tess-two.tesseract_plugin", function(require, exports, module) {
/*global cordova, module*/
module.exports = {
    createEvent: function (imagePath, langPath, lang, successCallback, errorCallback) {
        cordova.exec(
        	successCallback, 
        	errorCallback, 
        	"TesseractPlugin",                 //Service: Mapped to native java.class
        	"addTesseractPluginEntry",         //Action: The action name to call into on the native side
        	[imagePath, langPath, lang]); // An array of arguments. This string should contain path to image
    }
};

});
