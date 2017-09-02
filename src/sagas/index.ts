import { delay } from "redux-saga";
import { all, call, put } from "redux-saga/effects";

import { ActionConst } from "react-native-router-flux";

import { goBackRoute, goToRoute, onFocusRoute } from "./routes";

import {
  firebaseFacebookLogin,
  firebaseLogOut,
  getUser,
  listenUntilPurchaseSuccessOrFailure,
  updateHistory,
  updatePurchasePackages,
  updateReceivedBevegrams,
  updateUserStateOnNextChange,
} from "./firebase";

import { getLocationsAtUserLocation, getLocationsNearUser } from "./location";

import {
  InternetNotConnectedError,
  tryEveryIfInternetConnected,
} from "./internet";

import { tryEvery } from "./utilities";

import * as facebook from "./facebook";
import * as internet from "./internet";
import * as notifications from "./notifications";
import * as queue from "./queue";
import * as redeem from "./redeem";
import * as settings from "./settings";
import * as stripe from "./stripe";

// Like combine reducers
/* tslint:disable:object-literal-sort-keys */
export default function* rootSaga() {
  yield all([
    // Facebook
    tryEveryIfInternetConnected(
      "FACEBOOK_CONTACTS_RELOAD_REQUEST",
      facebook.reloadContacts,
      "banner",
    ),
    tryEveryIfInternetConnected(
      "REQUEST_APP_INVITE",
      facebook.startAppInvite,
      "alert",
      "Inviting",
    ),

    // Logging In
    tryEveryIfInternetConnected(
      "LOGIN",
      function*(action) {
        yield put({ type: "LOGIN_IN_PROGRESS" });
        const loginFailedMessage = "Facebook Login Failed";

        try {
          const facebookAccessToken = yield call(facebook.login);
          if (!facebookAccessToken) {
            throw new InternetNotConnectedError(loginFailedMessage);
          }
          yield call(goToRoute, { payload: { route: "MainUi" } });
          // Facebook user info is required to properly initialize a firebase user
          yield all([
            yield call(facebook.fetchContacts, facebookAccessToken),
            yield call(facebook.fetchUser, facebookAccessToken),
          ]);

          yield call(facebook.successfulLogin);
          yield call(firebaseFacebookLogin, facebookAccessToken);
          yield call(getUser);

          yield all([
            yield call(updatePurchasePackages),
            yield call(updateHistory),
            yield call(notifications.startListener),
            yield call(getLocationsNearUser),
          ]);
        } catch (e) {
          if (e instanceof InternetNotConnectedError) {
            // pass
          } else {
            throw e;
          }
        } finally {
          yield put({ type: "LOGIN_COMPLETE" });
        }
      },
      "alert",
      "Login",
    ),

    // Logging Out
    tryEvery("REQUEST_LOGOUT", function*(action) {
      yield call(goToRoute, action);
      const internetNotConnectedErrorMessage = "NoInternet";

      // If the user tries to logout when they are not connected to the
      // internet we honor their request but skip the actions that require
      // internet connectivity.
      try {
        if (!(yield call(internet.isConnected, "none") as any)) {
          throw new InternetNotConnectedError(internetNotConnectedErrorMessage);
        }
        yield call(facebook.logout);
        yield call(notifications.stopListener);
        yield call(firebaseLogOut, action);
      } catch (e) {
        if (e instanceof InternetNotConnectedError) {
          // pass
        } else {
          throw e;
        }
      } finally {
        const delayBeforeLoadComplete = 10;
        yield put({ type: "RESET_STATE" });
        yield delay(delayBeforeLoadComplete);
        yield put({ type: "LOADING_COMPLETE" });
      }
    }),

    // Handling credit cards
    tryEveryIfInternetConnected(
      "REQUEST_CREDIT_CARD_VERIFICATION",
      function*(action) {
        const cardToken = yield call(stripe.fetchCreditCardToken, action);
        if (cardToken) {
          yield call(queue.addCreditCardToCustomer, cardToken);
          yield call(
            updateUserStateOnNextChange,
            ["SUCCESSFUL_CREDIT_CARD_VERIFICATION", "GO_BACK_ROUTE"],
            ["FAILED_CREDIT_CARD_VERIFICATION"],
            "stripe.error",
          );
        }
      },
      "banner",
    ),

    tryEveryIfInternetConnected(
      "REQUEST_UPDATE_DEFAULT_CARD",
      function*(action) {
        yield put({ type: "ATTEMPTING_STRIPE_DEFAULT_CARD_UPDATE" });
        yield call(queue.updateDefaultCard, action);
        yield call(
          updateUserStateOnNextChange,
          ["RENDER_SUCCESSFUL_STRIPE_DEFAULT_CARD_UPDATE"],
          ["RENDER_FAILED_STRIPE_DEFAULT_CARD_UPDATE"],
          "stripe.error",
          true,
        );
      },
      "banner",
    ),

    tryEveryIfInternetConnected(
      "REQUEST_REMOVE_CARD",
      function*(action) {
        yield put({ type: "ATTEMPTING_STRIPE_REMOVE_CARD" });
        yield call(queue.removeCreditCardFromCustomer, action);
        yield call(
          updateUserStateOnNextChange,
          ["RENDER_SUCCESSFUL_STRIPE_REMOVE_CARD"],
          ["RENDER_FAILED_STRIPE_REMOVE_CARD"],
          "stripe.error",
          true,
        );
      },
      "banner",
    ),

    tryEveryIfInternetConnected(
      "PURCHASE_REQUEST_UPDATE_USER",
      function*() {
        yield put({ type: "ATTEMPTING_USER_REFRESH_FOR_PURCHASE" });
        yield call(getUser);
        yield call(updatePurchasePackages);
        yield put({ type: "COMPLETED_USER_REFRESH_FOR_PURCHASE" });
      },
      "banner",
    ),

    // Purchasing Then Sending
    tryEvery("PURCHASE_THEN_SEND_BEVEGRAM", function*(action) {
      const successfulRoute = yield call(goToRoute, action);

      if (!successfulRoute) {
        return;
      }

      yield call(queue.purchase, action);

      yield call(listenUntilPurchaseSuccessOrFailure);
      yield call(updateHistory);
    }),

    // Receive Bevegrams
    tryEveryIfInternetConnected(
      "FETCH_RECEIVED_BEVEGRAMS",
      function*(action) {
        yield put({ type: "ATTEMPTING_UPDATE_RECEIVED_BEVEGRAMS" });
        const receivedBevegrams = yield call(updateReceivedBevegrams);
        yield put({
          type: "UPDATE_RECEIVED_BEVEGRAMS",
          payload: {
            receivedBevegrams,
          },
        });
        yield put({ type: "SUCCESSFUL_UPDATE_RECEIVED_BEVEGRAMS" });
      },
      "banner",
    ),

    // Redeem Bevegram
    tryEveryIfInternetConnected(
      "ON_REDEEMABLE_BEVEGRAM_PRESS",
      redeem.onRedeemableBevegramPress,
      "banner",
    ),
    tryEveryIfInternetConnected(
      "ON_REDEEM_LOCATION_SELECTION",
      redeem.onRedeemLocationSelected,
      "banner",
    ),
    tryEveryIfInternetConnected("REDEEM_BEVEGRAM", redeem.redeem, "alert"),

    // Routes
    tryEvery("GO_TO_ROUTE", goToRoute),
    tryEvery("GO_BACK_ROUTE", goBackRoute),
    // Dispatch actions based on router events
    tryEvery(ActionConst.FOCUS, onFocusRoute),

    // Notifications
    tryEvery("START_NOTIFICATION_LISTENER", notifications.startListener),
    tryEvery("STOP_NOTIFICATION_LISTENER", notifications.stopListener),
    tryEvery("NOTIFICATION_CLICKED_WHILE_APP_IS_CLOSED", function*(action) {
      yield call(notifications.onNotificationClickedWhileAppIsClosed, action);
    }),
    tryEvery("SAVE_FCM_TOKEN", function*(action) {
      yield call(notifications.saveFcmToken, action);
    }),

    // History
    tryEveryIfInternetConnected(
      "REFRESH_HISTORY",
      function*(action) {
        yield call(updateHistory);
      },
      "banner",
    ),

    // Locations Near User
    tryEveryIfInternetConnected(
      "REQUEST_LOCATIONS_NEAR_USER",
      function*(action) {
        yield call(getLocationsNearUser);
      },
      "banner",
    ),
    tryEveryIfInternetConnected(
      "REQUEST_BAR_AT_USER_LOCATION",
      function*(action) {
        yield call(getLocationsAtUserLocation);
      },
      "banner",
    ),

    // Settings
    tryEveryIfInternetConnected(
      "TOGGLE_NOTIFICATION_SETTING",
      function*() {
        yield call(settings.toggleNotification);
      },
      "banner",
    ),
    tryEveryIfInternetConnected(
      "VERIFY_VENDOR_ID",
      function*(action) {
        yield call(redeem.verifyVendorId, action);
      },
      "alert",
    ),
  ]);
}
