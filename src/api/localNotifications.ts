import FCM from "react-native-fcm";
import {isAndroid} from "../ReactNativeUtilities";

const presentLocalNotification = () => {
  if (isAndroid) {
    FCM.presentLocalNotification({
      body: "Tap to buy him a Bevegram",
      icon: "ic_cake_white_48dp",
      large_icon: "ic_launcher",
      on_click: "SEND_BEVEGRAM_TO_CONTACT",
      priority: "max",
      show_in_foreground: true,
      title: "Today is Travis Caldwell's Birthday!",
    });
  } else {
    alert("Notifications are only supported on Android");
  }
};
