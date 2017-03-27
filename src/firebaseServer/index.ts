import Queue from "firebase-queue";

import {sendNotification} from "../api/notifications";
import {GetNotificationQueueUrl} from "../db/schema";
import {SetupAdminDb} from "./utils";

const db = SetupAdminDb();

/* tslint:disable:no-console */
console.log("Starting Firebase Server...");
console.log("Listening for changes on node: ", GetNotificationQueueUrl());

const notificationQueue = new Queue(db.ref(GetNotificationQueueUrl()), (data, progress, resolve, reject) => {
  console.log("New Queue Request, data:", data);
  sendNotification(data);
  console.log("Completed Queue Request");
  resolve();
});
