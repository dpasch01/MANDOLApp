package com.tesseract.plugin;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import com.googlecode.tesseract.android.TessBaseAPI;

import android.app.Activity;
import android.content.Intent;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.media.ExifInterface;
import android.os.Environment;
import android.util.Log;

public class TesseractPlugin extends CordovaPlugin {
	//public static final String DATA_PATH = Environment.getExternalStorageDirectory().toString();
			//.getExternalStorageDirectory().toString() + "/PhoneGapTessTwo/";

	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        try { 
            if (action.equals("addTesseractPluginEntry")) {
                String imagePath = args.getString(0);
			    String langPath = args.getString(1);
			    String lang = args.getString(2);

                Log.d("TESSERACT_EXECUTE", imagePath);
//                Log.d("TESSERACT_EXECUTE", imagePath.replace("file:///", ""));
//                Log.d("TESSERACT_CACHE", imagePath.replace("file:///", "").split("\\?")[0]);


			    if (imagePath != null && imagePath.length() > 0) {
		            callbackContext.success(TesseractExample(imagePath.replace("file:///", ""), langPath.replace("file:///", ""), lang));
		        } else {
		            callbackContext.error("Expected one non-empty string argument.");
		        }

                return true;
            }
            callbackContext.error("Invalid action");
            return false;
        } catch (Exception e) {
            System.err.println("Exception in Execute: " + e.getMessage());
            callbackContext.error(e.getMessage());
            return false;
        }
    }
	

	public String TesseractExampleTwo(String pathToPic, String pathToLang, String lang) { 
		String recognizedText = "";
		
		try {	
			BitmapFactory.Options options = new BitmapFactory.Options();
			options.inSampleSize = 4;

			// Before bitmap = decodeFile
			Bitmap bitmap = BitmapFactory.decodeFile(pathToPic, options);
		
			try {
				ExifInterface exif = new ExifInterface(pathToPic);
				int exifOrientation = exif.getAttributeInt(
						ExifInterface.TAG_ORIENTATION,
						ExifInterface.ORIENTATION_NORMAL);

				int rotate = 0;

				switch (exifOrientation) {
					case ExifInterface.ORIENTATION_ROTATE_90:
						rotate = 90;
						break;
					case ExifInterface.ORIENTATION_ROTATE_180:
						rotate = 180;
						break;
					case ExifInterface.ORIENTATION_ROTATE_270:
						rotate = 270;
						break;
				}

				if (rotate != 0) {
					// Getting width & height of the given image.
					int w = bitmap.getWidth();
					int h = bitmap.getHeight();

					// Setting pre rotate
					Matrix mtx = new Matrix();
					mtx.preRotate(rotate);

					// Rotating Bitmap
					bitmap = Bitmap.createBitmap(bitmap, 0, 0, w, h, mtx, false);
				}

				// Convert to ARGB_8888, required by tess
				bitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true);

			} catch (IOException e) {
				System.err.println("Couldn't correct orientation");
			}

			TessBaseAPI baseApi = new TessBaseAPI();
			baseApi.setDebug(true); //////////////////////////////////////////////////////////////////////////
			
			baseApi.init(pathToLang, lang+"eng");
			baseApi.setImage(bitmap);

			if(baseApi.getUTF8Text() == null) {
				recognizedText = "Empty String";
			} else {
				recognizedText = baseApi.getUTF8Text();
			}

			baseApi.end();
		} catch (Exception e){
			System.err.println("TesseractTwoExample: " + e.getMessage());
			recognizedText = "FEJL";
		}
		
		return recognizedText; //recognizedText = recognizedText.trim();
	}
	
	
	public String TesseractExample(String pathToPic, String pathToLang, String lang) {
		String recognizedText = "";
		
		try {
			TessBaseAPI baseApi = new TessBaseAPI();
			baseApi.init(pathToLang, determineOcrLanguage(lang));
            File tmp = new File(pathToPic);
			baseApi.setImage(new File(pathToPic));

			recognizedText = baseApi.getUTF8Text();
			
			baseApi.end();
		} catch (Exception e){
			System.err.println("Exception: " + e.getMessage());
			recognizedText = "FEJL";
		}

		return recognizedText; //recognizedText = recognizedText.trim();
	}

	private String determineOcrLanguage(String ocrLanguage) {
        final String english = "eng";
        if (!ocrLanguage.equals(english) && addEnglishData(ocrLanguage)) {
            return ocrLanguage + "+" + english;
        } else {
            return ocrLanguage;
        }

    }

    // when combining languages that have multi byte characters with english
    // training data the ocr text gets corrupted
    // but adding english will improve overall accuracy for the other languages
    private boolean addEnglishData(String mLanguage) {
        return !(mLanguage.startsWith("chi") || mLanguage.equalsIgnoreCase("tha")
                || mLanguage.equalsIgnoreCase("kor")
                //|| mLanguage.equalsIgnoreCase("hin")
                //|| mLanguage.equalsIgnoreCase("heb")
                || mLanguage.equalsIgnoreCase("jap")
                //|| mLanguage.equalsIgnoreCase("ell")
                || mLanguage.equalsIgnoreCase("bel")
                || mLanguage.equalsIgnoreCase("ara")
                || mLanguage.equalsIgnoreCase("grc")
                || mLanguage.equalsIgnoreCase("rus")
                || mLanguage.equalsIgnoreCase("vie"));
    }

}