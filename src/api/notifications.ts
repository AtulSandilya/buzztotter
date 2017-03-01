import theme from '../theme';
import secrets from '../secrets';
import {globalColors} from '../components/GlobalStyles';

export interface Notification {
  title: string;
  body: string;
  icon: string;
  action: string;
}

export const NotificationActions = {
  ShowNewReceivedBevegrams: 'SHOW_NEW_RECEIVED_BEVEGRAMS',
  ShowUpcomingBirthdays: 'SHOW_UPCOMING_BIRTHDAYS',
}

  export const sendNotification = (receiverGCMId: string, notif: Notification, data: Object = {}) => {
  const fullNotif = {
    "title": notif.title,
    "body": notif.body,
    "icon": notif.icon,
    // On android this color gets altered (I would imagine by some
    // accessibility requirement regarding contrast) so using a darker color
    // has a better chance of remaining unaltered.
    "color": globalColors.bevSecondary,
    "click_action": "fcm.ACTION.HELLO",
  }

  return fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `key=${secrets.firebaseServerKey}`,
    },
    // See https://firebase.google.com/docs/cloud-messaging/http-server-ref
    // for documentation for these parameters
    body: JSON.stringify({
      to: receiverGCMId,
      notification: fullNotif,
      data: Object.assign({}, data, {
        action: notif.action,
      }),
    })
  }).then((response) => {
    return response.json();
  })
}
