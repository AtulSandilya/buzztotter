// import { BriefUser, userJsonFile } from "./getUserList";
import * as log from "./log";
import parseEnv from "./parseEnv";
import * as prompt from "./prompt";
import SetupMultipleAdminDatabases from "./SetupMultipleAdminDatabases";

// import { GetTimeNow, PrettyFormatCentsToDollars } from "../CommonUtilities";
import * as Utils from "../CommonUtilities";
import {
  NotificationActions,
  NotificationPackage,
  PurchasePackage,
  ReceivedBevegram,
} from "../db/tables";
import { sendNotification } from "../firebaseServer/notifications";
import PurchasePackages from "../staticDbContent/PurchasePackages";
import theme from "../theme";

export interface BriefUser {
  firebaseUserId: string;
  name: string;
  email: string;
  gcmId: string;
}

export const userJsonFile = "users.json";

const main = async () => {
  const purchasePackageMap: { [packageName: string]: PurchasePackage } = {};
  PurchasePackages.map(pack => {
    purchasePackageMap[
      `${pack.quantity} for ${Utils.PrettyFormatCentsToDollars(pack.price)}`
    ] = pack;
  });

  const purchasePackage = await prompt.getChoice(
    "Choose a purchase package to send to each user",
    Object.keys(purchasePackageMap),
  );

  const selectedPurchasePackage = purchasePackageMap[purchasePackage];
  const q = selectedPurchasePackage.quantity;
  log.message(`\nReading users from ${userJsonFile}...\n`);
  const userJson = require(`../../${userJsonFile}`);
  const users: BriefUser[] = userJson.users;

  log.message(
    `Sending ${q} Bevegram${Utils.Pluralize(
      q,
    )} to ${users.length} users: \n\n${users
      .map(user => user.name)
      .join(",\n")}`,
  );

  log.failure(
    `Total Cost: ${Utils.PrettyFormatCentsToDollars(
      selectedPurchasePackage.price * users.length,
    )}\n`,
  );

  if (await prompt.confirm("Are you sure you want to continue")) {
    process.exit(0);
    let dbChoice = userJson.dbChoice;
    const env = parseEnv()[dbChoice];
    dbChoice += "Server";
    log.message(`Using ${dbChoice} database`);
    const db = (await SetupMultipleAdminDatabases(dbChoice))[0];

    const sendQuantity = purchasePackage.quantity;

    const receivedBevegram: ReceivedBevegram = {
      isRedeemed: false,
      message: "Enjoy a cold one on us!",
      quantity: sendQuantity,
      quantityRedeemed: 0,
      receivedDate: Utils.GetTimeNow(),
      sentFromFacebookId: "BuzzOtter",
      sentFromName: "BuzzOtter",
      sentFromPhotoUrl: "BuzzOtter",
    };

    for (const user of users) {
      log.message(`Sending ${sendQuantity} bevegram to ${user.name}!`);

      const id = await db.addReceivedBevegramToReceiverBevegrams(
        user.firebaseUserId,
        receivedBevegram,
      );

      log.message(`Received Bevegram id is ${id}`);

      if (user.gcmId) {
        const notif: NotificationPackage = {
          action: NotificationActions.ShowNewReceivedBevegrams,
          body: `BuzzOtter sent you ${sendQuantity} Bevegram${sendQuantity !== 1
            ? " s"
            : ""}`,
          data: {},
          icon: theme.notificationIcons.beverage,
          receiverGCMId: user.gcmId,
          title: "BuzzOtter",
        };

        const notifResult = await sendNotification(notif, env.FIREBASE_GCM_KEY);
        log.message(`NotifResult: ${notifResult}`);
      }

      log.success(
        `Successfully sent ${sendQuantity} bevegram to ${user.name}!`,
      );
    }
  } else {
    log.failure("Sending aborted");
  }
};

(async () => {
  await main();
})();
