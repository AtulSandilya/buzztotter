import fetch from "node-fetch";

import { config } from "dotenv";
config();

import theme from "../theme";

import { NotificationActions, NotificationPackage } from "../db/tables";

export const sendNotification = async (notif: NotificationPackage) => {
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

  const response = await fetch("https://fcm.googleapis.com/fcm/send", {
    // See https://firebase.google.com/docs/cloud-messaging/http-server-ref
    // for documentation for these parameters
    body: JSON.stringify({
      data: {
        ...notif.data,
        action: notif.action,
      },
      notification: fullNotif,
      to: notif.receiverGCMId,
    }),
    headers: {
      Accept: "application/json",
      Authorization: `key=${process.env.FIREBASE_GCM_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  return await response.json();
};
