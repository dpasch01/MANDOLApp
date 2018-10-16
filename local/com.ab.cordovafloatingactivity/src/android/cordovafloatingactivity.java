package com.ab.cordovafloatingactivityPack;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.File;
import java.io.FileOutputStream;

public class cordovafloatingactivity extends CordovaPlugin {

    public static final int REQUEST_ID_MULTIPLE_PERMISSIONS = 1;
    private static final int REQUEST_MEDIA_PROJECTION = 2;
    private PermissionChecker mPermissionChecker;
    private CallbackContext callbackContext;
    private CallbackContext screenshotCallback;
    private static File cache;

    public BroadcastReceiver receiver = new BroadcastReceiver() {

        @Override
        public void onReceive(Context context, Intent intent) {
            Log.d("RECEIVED_EVENT", "Received BUBBLE_PRESSED event.");
            String action = intent.getAction();
            if (action.equals("com.ab.cordovafloatingactivityPack.BUBBLE_PRESSED")) {
                Log.d("RECEIVED_ACTION", "Received BUBBLE_PRESSED action.");
                activateEvent();
            }
        }

    };

    public BroadcastReceiver scrReceiver = new BroadcastReceiver() {

        @Override
        public void onReceive(Context context, Intent intent) {
            Log.d("RECEIVED_EVENT", "Received BUBBLE_SCREENSHOT event.");
            String action = intent.getAction();
            if (action.equals("com.ab.cordovafloatingactivityPack.BUBBLE_SCREENSHOT")) {
                Log.d("RECEIVED_ACTION", "Received BUBBLE_SCREENSHOT action.");
                Log.d("SCREENSHOT_STATUS", "file://" + ChatHeadService.SCREENSHOT);

                Bitmap bitmap = BitmapFactory.decodeFile(ChatHeadService.SCREENSHOT);
                File jpeg = new File(cache.getAbsolutePath(), System.currentTimeMillis() + ".jpg");
                if (jpeg.exists()) {
                    jpeg.delete();
                }

                try {
                    FileOutputStream out = new FileOutputStream(jpeg);
                    bitmap.compress(Bitmap.CompressFormat.JPEG, 100, out);
                    out.flush();
                    out.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }

                ChatHeadService.SCREENSHOT = "file://" + jpeg.getAbsolutePath();
                ChatHeadService.changeView();
            }
        }

    };

    public void activateEvent() {
        if (callbackContext != null) {
            Log.d("CALLBACK_STATUS", "Callback Context not null.");
            PluginResult result = new PluginResult(PluginResult.Status.OK,
                    "{\"status\":\"success\", \"url\": \"" + ChatHeadService.COPIED_URL + "\", \"screenshot\":\"" + ChatHeadService.SCREENSHOT + "\"}"
            );
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);
            ChatHeadService.COPIED_URL = "";
            ChatHeadService.SCREENSHOT = "";
        } else {
            PluginResult result = new PluginResult(PluginResult.Status.ERROR, "{\"status\": \"error\", \"message\":\"Callback context not found.\"}");
            callbackContext.sendPluginResult(result);
        }
    }

    @Override
    public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException {
        cache = cordova.getActivity().getCacheDir();
        cache.mkdirs();

        PackageManager pm = cordova.getActivity().getPackageManager();
        Context context = cordova.getActivity().getApplicationContext();
        String packageName = "test";
        Boolean result = true;

        if (action.equals("startFloatingActivity")) {

            mPermissionChecker = new PermissionChecker(cordova.getActivity());
            if (!mPermissionChecker.isRequiredPermissionGranted()) {
                Intent intent = mPermissionChecker.createRequiredPermissionIntent();
                cordova.getActivity().startActivityForResult(intent, PermissionChecker.REQUIRED_PERMISSION_REQUEST_CODE);
            } else {
                initHookEvent();
                result = launchService(pm, context, packageName, context);

                if (result) {
                    callbackContext.success("success");
                } else {
                    callbackContext.success("false");
                }
                return result;
            }
        } else if (action.equals("stopFloatingActivity")) {
            result = stopService(pm, context, packageName, context);
            return result;
        } else if (action.equals("onBubblePress")) {
            Log.d("CALLBACK_CONTEXT", "Store callbackContext to call on event.");
            if (this.callbackContext == null) {
                this.callbackContext = callbackContext;
            }
            return true;

        } else {
            return false;
        }

        return true;

    }

    public void initHookEvent() {
        Log.d("APPENDING_EVENT", "Appended event onBubblePress.");
        Log.d("APPENDING_LISTENER", "Appended listener for BUBBLE_PRESSED.");

        IntentFilter filter_hook = new IntentFilter("com.ab.cordovafloatingactivityPack.BUBBLE_PRESSED");
        this.cordova.getActivity().getApplicationContext().registerReceiver(receiver, filter_hook);

        IntentFilter screenshot_hook = new IntentFilter("com.ab.cordovafloatingactivityPack.BUBBLE_SCREENSHOT");
        this.cordova.getActivity().getApplicationContext().registerReceiver(scrReceiver, screenshot_hook);

    }

    public boolean launchService(PackageManager pm, Context c, String packname, final Context con) {
        cordova.getActivity().startService(new Intent(cordova.getActivity().getApplication(), ChatHeadService.class));
        return true;
    }

    public boolean stopService(PackageManager pm, Context c, String packname, final Context con) {
        cordova.getActivity().stopService(new Intent(cordova.getActivity().getApplication(), ChatHeadService.class));
        return true;
    }

}
