import Queue from "firebase-queue";

import * as DbSchema from "../db/schema";

import {
  AddCreditCardToCustomerPackageForQueue,
  NotificationActions,
  NotificationPackage,
  PromoCodePackage,
  PurchasedBevegram,
  PurchasePackage,
  PurchasePackageForQueue,
  PurchaseTransactionStatus,
  ReceivedBevegram,
  RedeemPackageForQueue,
  RedeemTransactionStatus,
  RemoveCreditCardFromCustomerPackageForQueue,
  SentBevegram,
  STRIPE_MAX_NUMBER_OF_CREDIT_CARDS,
  StripeCreditCard,
  ToggleNotificationSettingPackageForQueue,
  UpdateDefaultCreditCardForCustomerPackageForQueue,
  User,
  UserRedeemedBevegram,
  Vendor,
  VendorRedeemedBevegram,
} from "../db/tables";

import theme from "../theme";
import * as stripe from "./stripe";

import FirebaseServerDb from "./FirebaseServerDb";

import Log from "./Log";

import {GetTimeNow} from "../CommonUtilities";

import {sendNotification} from "./notifications";
import SetupAdminDb from "./SetupAdminDb";

const db = new FirebaseServerDb(SetupAdminDb());

//  Add Card To Customer ------------------------------------------------{{{

/* tslint:disable:no-console */
const AddCardToCustomerQueueUrl = DbSchema.GetAddCreditCardToCustomerQueueUrl();
Log.StartQueueMessage(AddCardToCustomerQueueUrl);
const AddCardToCustomerQueue = new Queue(db.getRef(AddCardToCustomerQueueUrl),
  (data, progress, resolve, reject) => {
    const log = new Log("ADD_CARD_TO_CUSTOMER");
    const process = async () => {
      const input: AddCreditCardToCustomerPackageForQueue = data;
      const {stripeCreditCardToken, userFirebaseId, verificationToken} = input;
      const user: User = await db.readNode(DbSchema.GetUserDbUrl(userFirebaseId));
      try {
        // 1. Check user in firebase to see if there is a stripe customer id
        // 2. If no stripe customer create stripe customer
        // 3. Add card to customer on stripe
        // 4. Add card id to firebase
        await verifyUser(verificationToken, userFirebaseId);

        // TODO: Match the stripe token against some regex

        let userStripeId = await db.readNode(DbSchema.GetStripeCustomerIdDbUrl(userFirebaseId));

        if (!userStripeId) {
          userStripeId = (await stripe.promiseNewCustomer(user.fullName, user.email)).id;
          await db.writeNode(DbSchema.GetStripeCustomerIdDbUrl(userFirebaseId), userStripeId);
        } else {
          if (!user.stripe) {
            user.stripe = await stripe.promiseCustomer(userStripeId);
          }

          if (user.stripe && user.stripe.creditCards.length >= STRIPE_MAX_NUMBER_OF_CREDIT_CARDS) {
            throw new QueueServerError(`Cannot add more than ${STRIPE_MAX_NUMBER_OF_CREDIT_CARDS} credit cards`);
          }
        }

        const addedCard = await stripe.promiseAddCardToCustomer(userStripeId, stripeCreditCardToken);
        await stripe.promiseUpdateCustomerDefaultCard(userStripeId, addedCard.metadata.generatedId);

        user.stripe = await stripe.promiseCustomer(userStripeId);

        await updateUser(input.userFirebaseId, user);

        log.successMessage();
        resolve();
      } catch (e) {
        user.stripe = Object.assign({}, user.stripe, {
          error: e,
        });

        await updateUser(input.userFirebaseId, user);

        log.failMessage(e);

        resolve();
      }
    };
    process();
});

//  End Add Card To Customer --------------------------------------------}}}
//  Remove Card From Customer ------------------------------------------{{{

const RemoveCardFromCustomerQueueUrl = DbSchema.GetRemoveCreditCardFromCustomerQueueUrl();
Log.StartQueueMessage(RemoveCardFromCustomerQueueUrl);
const RemoveCardFromCustomerQueue = new Queue(
  db.getRef(RemoveCardFromCustomerQueueUrl),
  (data, progress, resolve, reject) => {
    const log = new Log("REMOVE_CARD_FROM_CUSTOMER");
    const process = async () => {
      const input: RemoveCreditCardFromCustomerPackageForQueue = data;
      const {stripeCardId, userFirebaseId, verificationToken} = input;

      try {
        await verifyUser(verificationToken, userFirebaseId);
        const userStripeId = await db.readNode(DbSchema.GetStripeCustomerIdDbUrl(userFirebaseId));

        const user: User = await db.readNode(DbSchema.GetUserDbUrl(userFirebaseId));
        await stripe.promiseDeleteCustomerCard(userStripeId, stripeCardId);

        user.stripe = await stripe.promiseCustomer(userStripeId);
        if (!user.stripe) {
          delete user.stripe;
        }

        await updateUser(input.userFirebaseId, user);

        log.successMessage();
        resolve();
      } catch (e) {
        // This is a special case where the user object from stripe may not
        // exist but we need to put the error in that object and write it to
        // the user.
        const userStripeId = await db.readNode(DbSchema.GetStripeCustomerIdDbUrl(userFirebaseId));
        const user: User = await db.readNode(DbSchema.GetUserDbUrl(userFirebaseId));
        user.stripe = await stripe.promiseCustomer(userStripeId);

        if (!user.stripe) {
          user.stripe = {};
        }

        user.stripe.error = e;

        await updateUser(input.userFirebaseId, user);

        log.failMessage(e);
        resolve();
      }
    };
    process();
});

//  End Remove Card From Customer --------------------------------------}}}
//  Update Default Card -------------------------------------------------{{{

const UpdateDefaultCardUrl = DbSchema.GetUpdateDefaultCreditCardForCustomerUrl();
Log.StartQueueMessage(UpdateDefaultCardUrl);
const UpdateDefaultCardQueue = new Queue(
  db.getRef(UpdateDefaultCardUrl),
  (data, progress, resolve, reject) => {
    const log = new Log("UPDATE_DEFAULT_CARD");
    const process = async () => {
      const input: UpdateDefaultCreditCardForCustomerPackageForQueue = data;
      const {stripeCardId, userFirebaseId, verificationToken} = input;

      const user: User = await db.readNode(DbSchema.GetUserDbUrl(userFirebaseId));
      try {
        await verifyUser(verificationToken, userFirebaseId);
        const userStripeId = await db.readNode(DbSchema.GetStripeCustomerIdDbUrl(userFirebaseId));

        await stripe.promiseUpdateCustomerDefaultCard(userStripeId, stripeCardId);

        user.stripe = await stripe.promiseCustomer(userStripeId);

        await updateUser(input.userFirebaseId, user);

        log.successMessage();

        resolve();
      } catch (e) {
        user.stripe = Object.assign({}, user.stripe, {
          error: e,
        });

        await updateUser(input.userFirebaseId, user);

        log.failMessage(e);
        resolve();
      }
    };
    process();
});

//  End Update Default Card ---------------------------------------------}}}
//  Purchase ------------------------------------------------------------{{{

const PurchaseQueueUrl = DbSchema.GetPurchaseQueueUrl();
Log.StartQueueMessage(PurchaseQueueUrl);
const PurchaseQueue = new Queue(db.getRef(PurchaseQueueUrl), (data, progress, resolve, reject) => {
  const log = new Log("PURCHASE");
  const process = async () => {
    const input: PurchasePackageForQueue = data;
    const {userFirebaseId, receiverFacebookId, purchaseQuantity, verificationToken, purchasePrice} = input;
    const user: User = await db.readNode(DbSchema.GetUserDbUrl(userFirebaseId));

    /* tslint:disable:object-literal-sort-keys */
    const status: PurchaseTransactionStatus = {
      connectionEstablished: "complete",
      creditCardTransaction: "inProgress",
      updatingDatabase: "pending",
      sendingNotification: "pending",
    };

    const updateStatus = async (): Promise<void> => {
      status.lastModified = GetTimeNow();
      await db.writeNode(DbSchema.GetPurchaseTransactionStatusDbUrl(userFirebaseId), status);
    };

    // 1. Verify Sender, get sender info
    // 2. Verify Receiver, get receiver information
    // 3. Verify purchase details (price, quantity, etc)
    // 4. Perform purchase
    // 5. Update db - take code from api/firebase
    // 6. Send notification

    try {
      await verifyUser(verificationToken, userFirebaseId);
      const userStripeId = await db.readNode(DbSchema.GetStripeCustomerIdDbUrl(userFirebaseId));

      await updateStatus();

      const receiverFirebaseId = await db.readNode(DbSchema.GetFirebaseIdDbUrl(receiverFacebookId));
      if (!receiverFirebaseId) {
        throw new QueueServerError("Sender does not exist in our records");
      }

      const receiver: User = await db.readNode(DbSchema.GetUserDbUrl(receiverFirebaseId));

      const purchasePackages: PurchasePackage[] = await db.readNode(DbSchema.GetPurchasePackagesDbUrl());

      const matchingPurchasePackage = purchasePackages.filter((val) => {
        if (val.quantity === purchaseQuantity && val.price === purchasePrice) {
          return true;
        }
        return false;
      });

      if (matchingPurchasePackage.length !== 1) {
        throw new QueueServerError("Invalid Purchase Details");
      }

      /* tslint:disable:max-line-length */
      const purchaseDescription = `BuzzOtter: Sent ${purchaseQuantity} bevegram${purchaseQuantity !== 1 ? "s" : ""} to ${receiver.fullName}`;
      const chargeResponse = await stripe.promiseCreditCardPurchase(userStripeId, purchasePrice, purchaseDescription);

      status.creditCardTransaction = "complete";
      status.updatingDatabase = "inProgress";
      await updateStatus();

      // Use api/firebase code here to update summaries and lists
      const purchasedBevegram: PurchasedBevegram = {
        chargeId: chargeResponse.id,
        purchaseDate: GetTimeNow(),
        purchasePrice,
        purchasedByFacebookId: user.facebook.id,
        purchasedById: user.firebase.uid,
        purchasedByName: user.fullName,
        quantity: purchaseQuantity,
      };

      // TODO: Consistently format promo code on client and server
      let promoCode = input.promoCode;
      if (promoCode) {
        promoCode = promoCode.toUpperCase();
        purchasedBevegram.promoCode = promoCode;

        const promoCodePack: PromoCodePackage = {
          purchaseDate: GetTimeNow(),
          purchasedByUserId: user.firebase.uid,
          quantity: purchaseQuantity,
        };

        await db.addPromoCode(promoCode, promoCodePack);
      }

      const purchasedBevegramId = await db.addPurchasedBevegramToUser(userFirebaseId, purchasedBevegram);

      const sentBevegram: SentBevegram = {
        purchasedBevegramId,
        quantity: purchaseQuantity,
        receiverName: receiver.fullName,
        sendDate: GetTimeNow(),
      };

      const sendId = await db.addSentBevegramToUser(userFirebaseId, sentBevegram);
      await db.updatePurchasedBevegramWithSendId(userFirebaseId, purchasedBevegramId, sendId);

      const receivedBevegram: ReceivedBevegram = {
        isRedeemed: false,
        quantity: purchaseQuantity,
        quantityRedeemed: 0,
        receivedDate: GetTimeNow(),
        sentFromFacebookId: user.facebook.id,
        sentFromName: user.fullName,
        sentFromPhotoUrl: user.firebase.photoURL,
      };

      if (input.message) {
        receivedBevegram.message = input.message;
      }

      await db.addReceivedBevegramToReceiverBevegrams(receiver.firebase.uid, receivedBevegram);

      status.updatingDatabase = "complete";
      status.sendingNotification = "inProgress";
      await updateStatus();

      const receiverGCMId = await db.readNode(DbSchema.GetFcmTokenDbUrl(receiver.facebook.id));

      if (!receiverGCMId || receiverGCMId.length === 0) {
        console.log("Could not find receiver fcm token");
        status.sendingNotification = "complete";
        await updateStatus();
      } else {
        const notif: NotificationPackage = {
          receiverGCMId,
          action: NotificationActions.ShowNewReceivedBevegrams,
          body: `${user.fullName} sent you ${purchaseQuantity} Bevegram${purchaseQuantity !== 1 ? " s" : ""}`,
          data: {},
          icon: theme.notificationIcons.beverage,
          title: "BuzzOtter",
        };

        const notifResult = await sendNotification(notif);
        const jsonSpaces = 2;
        console.log("notifResult: ", notifResult);

        setTimeout(() => {
          status.sendingNotification = "complete";
          updateStatus();
        }, 500);
      }

      log.successMessage();
    } catch (e) {
      // TODO: Figure out some way to track progress and roll back the db if
      // there is a problem
      status.error = e.message ? e.message : e;
      await updateStatus();
      log.failMessage(e);
    }

    resolve();
  };
  process();
});

//  End Purchase --------------------------------------------------------}}}
//  Redeem -------------------------------------------------------------{{{

const RedeemQueueUrl = DbSchema.GetRedeemQueueUrl();
Log.StartQueueMessage(RedeemQueueUrl);
const RedeemQueue = new Queue(db.getRef(RedeemQueueUrl), (data, progress, resolve, reject) => {
  const log = new Log("REDEEM");
  const process = async () => {
    const input: RedeemPackageForQueue = data;
    const {userFirebaseId, receivedId, location: loc, quantity, verificationToken}  = input;
    const user: User = await db.readNode(DbSchema.GetUserDbUrl(userFirebaseId));

    const status: RedeemTransactionStatus = {
      connectionEstablished: "complete",
      updatingDatabase: "pending",
    };

    const updateStatus = async (): Promise<void> => {
      status.lastModified = GetTimeNow();
      await db.writeNode(DbSchema.GetRedeemTransactionStatusDbUrl(userFirebaseId), status);
    };
    updateStatus();

    // 1. Verify the redeem location matches the vendor location
    // 2. Verify the received id matches and has enough quantity to redeem the
    // requested quantity
    // 3. Do it!

    try {
      await verifyUser(verificationToken, userFirebaseId);
      const vendor: Vendor = (await(db.readNode(DbSchema.GetVendorDbUrl(loc.vendorId)))).metadata;

      // Verify location and vendor match
      const validLatitude = loc.latitude === vendor.latitude;
      const validLongitude = loc.longitude === vendor.longitude;
      const validAddress = loc.address === vendor.address;

      if (!(validLatitude && validLongitude && validAddress)) {
        throw new QueueServerError(`Unable to verify ${loc.name}`);
      }

      const receivedBevegram: ReceivedBevegram = await db.readNode(DbSchema.GetReceivedBevegramListDbUrl(userFirebaseId) + `/${receivedId}`);

      if (quantity > (receivedBevegram.quantity - receivedBevegram.quantityRedeemed)) {
        throw new QueueServerError(`You do not have enough bevegrams to redeem!`);
      }

      const updatedReceivedBevegram: ReceivedBevegram = Object.assign({}, receivedBevegram, {
        quantityRedeemed: receivedBevegram.quantityRedeemed + quantity,
      });

      const userRedeemedBevegram: UserRedeemedBevegram = {
        receivedId,
        redeemedDate: GetTimeNow(),
        vendorName: vendor.name,
        vendorId: loc.vendorId,
        vendorPin: "1234",
        quantity,
      };

      const vendorRedeemedBevegram: VendorRedeemedBevegram = {
        receivedId,
        redeemedByName: user.fullName,
        redeemedByUserId: userFirebaseId,
        redeemedByPhotoUrl: user.firebase.photoURL,
        redeemedDate: GetTimeNow(),
        quantity,
      };

      // Write to db
      await db.redeemUserBevegram(
        userFirebaseId,
        userRedeemedBevegram,
        receivedId,
        updatedReceivedBevegram,
      );

      await db.redeemVendorBevegram(loc.vendorId, vendorRedeemedBevegram);

      setTimeout(() => {
        // Allow time for the listener on the client to setup
        status.updatingDatabase = "complete";
        updateStatus();
        log.successMessage();
      }, 500);
    } catch (e) {
      setTimeout(() => {
        // Allow time for the listener on the client to setup
        status.error = e.message;
        status.updatingDatabase = "failed";
        updateStatus();
        log.failMessage(e);
      }, 500);
    }
    resolve();
  };
  process();
});

//  End Redeem ---------------------------------------------------------}}}
//  Toggle Notification Setting -----------------------------------------{{{

const ToggleNotificationSettingUrl = DbSchema.GetToggleNotificationSettingQueueUrl();
Log.StartQueueMessage(ToggleNotificationSettingUrl);
const ToggleNotificationSettingQueue = new Queue(
  db.getRef(ToggleNotificationSettingUrl),
  (data, progress, resolve, reject) => {
    const process = async () => {
      const log = new Log("TOGGLE_NOTIFICATION_SETTING");
      const input: ToggleNotificationSettingPackageForQueue = data;
      const {fcmToken, userFirebaseId, verificationToken} = input;

      const user: User = await db.readNode(DbSchema.GetUserDbUrl(userFirebaseId));
      try {
        await verifyUser(verificationToken, userFirebaseId);

        if (fcmToken) {
          await db.writeNode(DbSchema.GetFcmTokenDbUrl(user.facebook.id), fcmToken);
        } else {
          await db.deleteNode(DbSchema.GetFcmTokenDbUrl(user.facebook.id));
        }

        log.successMessage();
        resolve();
      } catch (e) {
        log.failMessage(e);
        resolve();
      }
    };
    process();
  },
);

//  End Toggle Notification Setting -------------------------------------}}}
//  Utils --------------------------------------------------------------{{{

const verifyUser = async (verificationToken: string, userFirebaseId: string) => {
  const tokenInDb = await db.readNode(DbSchema.GetUserVerificationTokenDbUrl(userFirebaseId));

  if (tokenInDb !== verificationToken) {
    console.log(`${tokenInDb} != ${verificationToken}`);
    throw new QueueServerError("Verification tokens do not match!");
  }
};

const updateUser = async (userFirebaseId, user: User) => {
  // This is important as it triggers a "child_changed" event which the
  // client is listening for.
  const updatedUser: User = Object.assign({}, user, {
    lastModified: GetTimeNow(),
  });
  await db.writeNode(DbSchema.GetUserDbUrl(userFirebaseId), updatedUser);
};

class QueueServerError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "QueueServerError";
  }
}

//  End Utils ----------------------------------------------------------}}}
//  Shutdown ------------------------------------------------------------{{{

const shutdownQueue = async () => {
  const shutdownStart = Date.now();
  console.log("Gracefully shutting down queue...");
  const addCardToCustomerShutdown = AddCardToCustomerQueue.shutdown();
  const removeCardFromCustomerShutdown = RemoveCardFromCustomerQueue.shutdown();
  const updateDefaultCardShutdown = UpdateDefaultCardQueue.shutdown();
  const purchaseShutdown = PurchaseQueue.shutdown();
  const redeemShutdown = RedeemQueue.shutdown();
  const toggleNotificationShutdown = ToggleNotificationSettingQueue.shutdown();

  await Promise.all([
    addCardToCustomerShutdown,
    removeCardFromCustomerShutdown,
    updateDefaultCardShutdown,
    purchaseShutdown,
    redeemShutdown,
    toggleNotificationShutdown,
  ]);

  console.log(`Queue shutdown completed in ${Date.now() - shutdownStart}ms!`);
  process.exit(0);
};

// When pressing <C-c> on the command line
process.on("SIGINT", async () => {
  await shutdownQueue();
});

// Signal heroku sends to terminate the node process
process.on("SIGTERM", async () => {
  await shutdownQueue();
});

//  End Shutdown --------------------------------------------------------}}}
