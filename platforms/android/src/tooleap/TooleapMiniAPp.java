package tooleap;

import android.os.Bundle;

import com.mandola.reporting.R;
import com.tooleap.sdk.TooleapActivities;

public class TooleapMiniApp extends TooleapActivities.Activity {

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.tooleap);
    }

}
