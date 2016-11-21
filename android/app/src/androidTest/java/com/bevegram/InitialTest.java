package com.bevegram;

import android.support.test.rule.ActivityTestRule;
import android.support.test.runner.AndroidJUnit4;
import android.test.suitebuilder.annotation.LargeTest;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import java.lang.InterruptedException;

import static android.support.test.espresso.Espresso.onView;
import static android.support.test.espresso.action.ViewActions.click;
import static android.support.test.espresso.action.ViewActions.pressBack;
import static android.support.test.espresso.action.ViewActions.swipeDown;
import static android.support.test.espresso.matcher.ViewMatchers.withContentDescription;
import static android.support.test.espresso.matcher.ViewMatchers.withText;

@RunWith(AndroidJUnit4.class)
@LargeTest
public class InitialTest {

    @Rule
    public ActivityTestRule<MainActivity> mActivityRule = new ActivityTestRule<>(MainActivity.class);

    @Test
    public void attemptLogin() throws InterruptedException {
        Thread.sleep(5000);

        try {
            onView(withText("Log in with Facebook")).perform(click());
        } catch(Exception e){
            // continue
        }

        // It would make sense to separate the next actions but for whatever
        // reason this doesn't work. More investigation needed. This might
        // need to go in another file?

        List<String> NavButtons = new ArrayList<String>(Arrays.asList("Bevegrams", "Map", "History", "Map", "Bevegrams", "Contacts"));

        for(String button : NavButtons){
            onView(withText(button)).perform(click());

            Thread.sleep(500);
        }

        for(int i = 0; i < NavButtons.size(); i++){
            onView(withText("Bevegrams")).perform(pressBack());
            Thread.sleep(50);
        }

        Thread.sleep(1500);

        // Test Pull down to refresh
        // "Contacts List" is the react-native accessibilityLabel
        onView(withContentDescription("Contacts List")).perform(swipeDown());

        Thread.sleep(5000);
    }
}
