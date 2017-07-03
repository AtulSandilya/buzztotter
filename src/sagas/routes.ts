import { call } from "redux-saga/effects";

import { Keyboard, ToastAndroid } from "react-native";
import { put, select } from "redux-saga/effects";

import { ActionConst, Actions } from "react-native-router-flux";

import { RouteState } from "../reducers/routes";

import { isAndroid, isIOS } from "../ReactNativeUtilities";

import { IsPurchaseAndOrSendCompleted } from "../components/PurchaseAndOrSendInProgress";

import { updatePurchasePackages } from "./firebase";
import * as internet from "./internet";

/* tslint:disable:object-literal-sort-keys */
export function* goToRoute(action) {
  const nextRoute = action.payload.route;
  const routeState = yield select<{ routes: RouteState }>(
    state => state.routes,
  );

  const nextRouteState = routeState[nextRoute];

  if (!nextRouteState) {
    throw new Error(`Route '${nextRoute}' does not have a reducer!`);
  }

  if (nextRouteState.requiresInternetConnection) {
    if (
      !(yield call(
        internet.isConnected,
        "alert",
        nextRouteState.prettyAction,
      ) as any)
    ) {
      return false;
    }
  }

  let nextRouteData = {};
  if (action.payload.routeData) {
    nextRouteData = action.payload.routeData;
  }

  yield put({
    type: "ADD_ROUTE",
    payload: {
      data: nextRouteData,
      route: nextRoute,
    },
  });

  Actions[nextRoute]();

  if (nextRoute === "SendBevegram" || nextRoute === "PurchaseBevegram") {
    yield call(updatePurchasePackages);
  }
  return true;
}

interface GoBackRoutePayloadProps {
  route: string;
  nextRoute: string;
  preActions?: [{ any }];
  postActions?: [{ any }];
}

export function* goBackRoute(action) {
  const nextRoute = yield select<{ routes: RouteState }>(
    state => state.routes.previousRoute,
  );
  const currentRoute = yield select<{ routes: RouteState }>(
    state => state.routes.currentRoute,
  );

  const routesThatDontGoBack = {
    Login: true,
    MainUi: true,
  };

  if (routesThatDontGoBack[currentRoute] === undefined) {
    Keyboard.dismiss();

    // Android: Disable the back button while a purchase and/or send
    // is in progress
    if (
      currentRoute === "PurchaseInProgress" ||
      currentRoute === "SendInProgress"
    ) {
      const purchaseState = yield select<any>(state => state.purchase);
      const routeState = yield select<{ routes: RouteState }>(state => {
        return {
          ...state.routes.PurchaseInProgress.data,
          ...state.routes.SendInProgress.data,
        };
      });

      const purchaseTransactionStatus = yield select<{ purchase: any }>(
        state => state.purchase.purchaseTransactionStatus,
      );
      const allowGoBack = IsPurchaseAndOrSendCompleted(
        purchaseTransactionStatus,
      );

      if (!allowGoBack) {
        if (isAndroid) {
          ToastAndroid.showWithGravity(
            `Please wait until ${routeState.userIsPurchasing
              ? "purchasing"
              : "sending"} is complete.`,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        }
        return;
      } else {
        Actions.MainUi({ type: ActionConst.BACK, popNum: 2 });
      }
    } else {
      Actions[nextRoute]({ type: ActionConst.BACK });
    }

    yield put({
      type: "CLOSE_ROUTE",
      payload: {
        route: currentRoute,
      },
    });
    // Inside the `MainUi` route the back button should go back a tab
  } else if (currentRoute === "MainUi") {
    yield put({ type: "GOBACK_VIEW" });
  }
}

export function* onFocusRoute(action) {
  if (action.scene) {
    yield put({
      type: "UPDATE_CURRENT_ROUTE",
      payload: {
        currentRoute: action.scene.name,
      },
    });

    // Dispatch actions when a scene comes into focus. This avoids updating a
    // scene during a transition.
    switch (action.scene.name) {
      case "PurchaseBevegram":
      case "SendBevegram":
        yield put({ type: "END_CREDIT_CARD_VERIFICATION_IF_NOT_ATTEMPTING" });
        break;
      case "MainUi":
        yield put({ type: "END_CREDIT_CARD_PURCHASE_IF_NOT_ATTEMPTING" });
        yield put({ type: "CLEAR_ROUTES" });
        yield put({ type: "RESET_REDEEM" });
        yield put({ type: "RESET_MESSAGE" });
        break;
      default:
        return;
    }
  }
}
