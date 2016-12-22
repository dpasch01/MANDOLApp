package com.ab.cordovafloatingactivityPack;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

public class cordovafloatingactivity extends CordovaPlugin {

    private PermissionChecker mPermissionChecker;
    private CallbackContext callbackContext;
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


    public void activateEvent(){
        PluginResult pluginResult;
        pluginResult = new PluginResult(PluginResult.Status.OK, "BUBBLE_PRESSED");
        pluginResult.setKeepCallback(true);

        if(callbackContext != null){
            Log.d("CALLBACK_STATUS", "Callback Context not null.");
            callbackContext.sendPluginResult(pluginResult);
        }
    }

    @Override
    public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException {

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
            this.callbackContext = callbackContext;
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
