package com.ab.cordovafloatingactivityPack;

import android.app.Service;
import android.content.ClipboardManager;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Environment;
import android.os.FileObserver;
import android.os.IBinder;
import android.util.Log;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;

import com.mandola.reporting.R;

import java.io.File;

public class ChatHeadService extends Service {

    public static String COPIED_URL = "";
    public static String SCREENSHOT = "";

    private static WindowManager windowManager;
    public static ImageView chatHead;
    private static String SCREENSHOT_PATH = Environment.getExternalStorageDirectory() + File.separator + Environment.DIRECTORY_PICTURES + File.separator + "Screenshots" + File.separator;

    public static void changeView() {
        if (!COPIED_URL.isEmpty() && !SCREENSHOT.isEmpty()) {
            chatHead.setImageResource(R.drawable.both);
        } else if (!COPIED_URL.isEmpty()) {
            chatHead.setImageResource(R.drawable.url);
        } else {
            chatHead.setImageResource(R.drawable.screenshot);
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        FileObserver fileObserver = new FileObserver(ChatHeadService.SCREENSHOT_PATH, FileObserver.CREATE) {
            @Override
            public void onEvent(int event, String path) {

                Log.d("SCREENSHOT_EVENT", ChatHeadService.SCREENSHOT_PATH + path);
                ChatHeadService.SCREENSHOT = ChatHeadService.SCREENSHOT_PATH + path;

                File file = new File(ChatHeadService.SCREENSHOT);
                long bytes = file.length();
                boolean completed = false;

                Log.d("WAITING_SCREENSHOT", "Waiting for screenshot.");

                while (!completed) {
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    long b = file.length();
                    if (b > bytes) {
                        bytes = b;
                    } else {
                        completed = true;
                    }
                }

                Intent i = new Intent("com.ab.cordovafloatingactivityPack.BUBBLE_SCREENSHOT");
                sendBroadcast(i);
            }
        };

        fileObserver.startWatching();

        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);

        chatHead = new ImageView(this);
        chatHead.setImageResource(com.mandola.reporting.R.drawable.idle);

        final WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.TYPE_PHONE,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT
        );

        params.gravity = Gravity.TOP | Gravity.LEFT;
        params.x = 0;
        params.height = 120;
        params.width = 120;
        params.y = 100;

        windowManager.addView(chatHead, params);

        ClipboardManager.OnPrimaryClipChangedListener mPrimaryChangeListener = new ClipboardManager.OnPrimaryClipChangedListener() {
            public void onPrimaryClipChanged() {
                ClipboardManager clipboard = (ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
                ChatHeadService.COPIED_URL = clipboard.getPrimaryClip().getItemAt(0).getText().toString();
                Log.d("CLIPBOARD_CONTENT", clipboard.getPrimaryClip().toString());
                changeView();
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
                    } else {
                        Log.d("EVENT", "Ouch! You pressed me!");

                        Intent i = new Intent("com.ab.cordovafloatingactivityPack.BUBBLE_PRESSED");
                        sendBroadcast(i);

                        Log.d("FIRED_EVENT", "Fired BUBBLE_PRESSED event.");

                        chatHead.setImageResource(R.drawable.idle);
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
