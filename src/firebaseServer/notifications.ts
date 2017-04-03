import fetch from "node-fetch";

import theme from "../theme";

import { Notification, NotificationActions} from "../db/tables";

export const sendNotification = (notif: Notification) => {
  const fullNotif = {
    body: notif.body,
    click_action: "fcm.ACTION.HELLO",
    // On android this color gets altered (I would imagine by some
    // accessibility requirement regarding contrast) so using a darker color
    // has a better chance of remaining unaltered.
    color: theme.colors.bevSecondary,
    icon: notif.icon,
    title: notif.title,
  };

  return fetch("https://fcm.googleapis.com/fcm/send", {
    // See https://firebase.google.com/docs/cloud-messaging/http-server-ref
    // for documentation for these parameters
    body: JSON.stringify({
      data: Object.assign({}, notif.data, {
        action: notif.action,
      }),
      notification: fullNotif,
      to: notif.receiverGCMId,
    }),
    headers: {
      "Authorization": `key=${process.env.TEST_FIREBASE_GCM_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  }).then((response) => {
    return response.json();
  });
};