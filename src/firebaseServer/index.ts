import Queue from "firebase-queue";

import * as DbSchema from "../db/schema";

import {
  AddCreditCardToCustomerPackageForQueue,
  PurchasePackageForQueue,
  RedeemPackageForQueue,
  RemoveCreditCardFromCustomerPackageForQueue,
  STRIPE_MAX_NUMBER_OF_CREDIT_CARDS,
  StripeCreditCard,
  UpdateDefaultCreditCardForCustomerPackageForQueue,
  User,
} from "../db/tables";

import * as stripe from "./stripe";

import FirebaseDb from "../api/firebase/FirebaseDb";

import Log from "./Log";

import {sendNotification} from "./notifications";
import {SetupAdminDb} from "./utils";

const db = new FirebaseDb(SetupAdminDb());

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

const notificationQueue = new Queue(db.ref(GetNotificationQueueUrl()), (data, progress, resolve, reject) => {
  console.log("New Queue Request, data:", data);
  sendNotification(data);
  console.log("Completed Queue Request");
  resolve();
});

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
  const updatedUser = Object.assign({}, user, {
    lastModified: Date.now().toString(),
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
