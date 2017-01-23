package com.ab.cordovafloatingactivityPack;

import android.app.Service;
import android.content.ClipboardManager;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.IBinder;
import android.util.Log;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;

public class ChatHeadService extends Service {

    public static String COPIED_URL = "";

    private WindowManager windowManager;
    private ImageView chatHead;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);

        chatHead = new ImageView(this);
        chatHead.setImageResource(com.mandola.reporting.R.drawable.circle);

        final WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.TYPE_PHONE,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT);

        params.gravity = Gravity.TOP | Gravity.LEFT;
        params.x = 0;
        params.height = 140;
        params.width = 140;
        params.y = 100;

        windowManager.addView(chatHead, params);

        ClipboardManager.OnPrimaryClipChangedListener mPrimaryChangeListener = new ClipboardManager.OnPrimaryClipChangedListener() {
            public void onPrimaryClipChanged() {
                chatHead.setImageResource(com.mandola.reporting.R.drawable.circle_sensed);
                ClipboardManager clipboard = (ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
                ChatHeadService.COPIED_URL = clipboard.getPrimaryClip().getItemAt(0).getText().toString();
                Log.d("CLIPBOARD_CONTENT", clipboard.getPrimaryClip().toString());
            }
        };

        ClipboardManager clipboardManager = (ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
        clipboardManager.addPrimaryClipChangedListener(mPrimaryChangeListener);

        chatHead.setOnTouchListener(new View.OnTouchListener() {
            boolean flag = false;
            private int initialX;
            private int initialY;
            private float offsetX;
            private float offsetY;
            private float initialTouchX;
            private float initialTouchY;

            @Override
            public boolean onTouch(View v, MotionEvent event) {

                if (event.getAction() == MotionEvent.ACTION_DOWN) {
                    float x = event.getRawX();
                    float y = event.getRawY();

                    flag = false;

                    int[] location = new int[2];
                    chatHead.getLocationOnScreen(location);

                    initialX = location[0];
                    initialY = location[1];

                    offsetX = initialX - x;
                    offsetY = initialY - y;

                } else if (event.getAction() == MotionEvent.ACTION_MOVE) {
                    int[] topLeftLocationOnScreen = new int[2];

                    float x = event.getRawX();
                    float y = event.getRawY();

                    WindowManager.LayoutParams params = (WindowManager.LayoutParams) chatHead.getLayoutParams();

                    int newX = (int) (offsetX + x);
                    int newY = (int) (offsetY + y);

                    if (Math.abs(newX - initialX) < 1 && Math.abs(newY - initialY) < 1 && !flag) {
                        return false;
                    }

                    params.x = newX - (topLeftLocationOnScreen[0]);
                    params.y = newY - (topLeftLocationOnScreen[1]);

                    windowManager.updateViewLayout(chatHead, params);
                    flag = true;
                } else if (event.getAction() == MotionEvent.ACTION_UP) {
                    if (flag) {
                        return true;
                    }else{
                        Log.d("EVENT", "Ouch! You pressed me!");
                        Intent i = new Intent("com.ab.cordovafloatingactivityPack.BUBBLE_PRESSED");
                        sendBroadcast(i);

                        Log.d("FIRED_EVENT", "Fired BUBBLE_PRESSED event.");
                        chatHead.setImageResource(com.mandola.reporting.R.drawable.circle);
                    }
                }

                return false;
            }


        });
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (chatHead != null) windowManager.removeView(chatHead);
    }


}
