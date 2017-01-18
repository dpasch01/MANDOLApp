package by.chemerisuk.cordova.coreextensions;

import org.json.JSONArray;
import org.json.JSONException;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;

import java.util.List;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Color;
import android.os.Build;
import android.net.Uri;
import android.view.WindowManager.LayoutParams;
import android.util.Log;


public class CoreAndroidExtensions extends CordovaPlugin {
    public static final String PLUGIN_NAME = "CoreAndroidExtensions";

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("minimizeApp")) {
            this.minimizeApp(args.optBoolean(0, false));
        } else if (action.equals("resumeApp")) {
            this.resumeApp(args.optBoolean(0, false));
        }

        callbackContext.success();

        return true;
    }

    @Override
    protected void pluginInitialize() {
        String colorStr = preferences.getString("RecentsBackgroundColor", "");

        if (colorStr != null && !colorStr.isEmpty()) {
            setTaskColor(colorStr);
        }
    }

    @Override
    public void onPause(boolean multitasking) {
        clearWindowFlags();
    }

    private void minimizeApp(boolean moveBack) {
        // try to send it back and back to previous app
        if (moveBack) {
            moveBack = cordova.getActivity().moveTaskToBack(true);
        }

        // if not possible jump to home
        if (!moveBack) {
            Intent intent = new Intent(Intent.ACTION_MAIN);
            intent.addCategory(Intent.CATEGORY_HOME);
            cordova.getActivity().startActivity(intent);
        }
    }

    private void resumeApp(boolean force) {
        Context ctx = cordova.getActivity().getApplicationContext();
        Intent intent = new Intent(ctx, cordova.getActivity().getClass());

        intent.setAction(Intent.ACTION_MAIN);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED | Intent.FLAG_FROM_BACKGROUND | Intent.FLAG_ACTIVITY_NO_ANIMATION);

        ctx.startActivity(intent);

        if (force) {
            setupWindowFlags();
        }
    }

    private void setupWindowFlags() {
        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                cordova.getActivity().getWindow().addFlags(
                    LayoutParams.FLAG_SHOW_WHEN_LOCKED | LayoutParams.FLAG_DISMISS_KEYGUARD | LayoutParams.FLAG_TURN_SCREEN_ON);
            }
        });
    }

    private void clearWindowFlags() {
        cordova.getActivity().getWindow().clearFlags(
            LayoutParams.FLAG_SHOW_WHEN_LOCKED | LayoutParams.FLAG_DISMISS_KEYGUARD | LayoutParams.FLAG_TURN_SCREEN_ON);
    }

    private void setTaskColor(String colorStr) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            ActivityManager activityManager = (ActivityManager) cordova.getActivity().getSystemService(Context.ACTIVITY_SERVICE);

            try {
                int color = Color.parseColor(colorStr);

                for (ActivityManager.AppTask appTask : activityManager.getAppTasks()) {
                    if (appTask.getTaskInfo().id == cordova.getActivity().getTaskId()) {
                        ActivityManager.TaskDescription taskInfo = appTask.getTaskInfo().taskDescription;
                        cordova.getActivity().setTaskDescription(new ActivityManager.TaskDescription(
                            taskInfo.getLabel(), taskInfo.getIcon(), color));
                    }
                }
            } catch (IllegalArgumentException ignore) {
                Log.e(PLUGIN_NAME, "Invalid color or description argument, use a hex string e.g. #00FF00 for color and a non-empty string for description");
            }
        }
    }

}