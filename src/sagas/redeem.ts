import { call, put, select } from "redux-saga/effects";

import { Keyboard } from "react-native";

import { goToRoute } from "./routes";

import { SelectedBevegramPackage } from "../components/Bevegram";
import { Location, VENDOR_ID_LENGTH } from "../db/tables";
import { BannerProps } from "../reducers/banner";
import { RouteState } from "../reducers/routes";

//  onRedeemableBevegramPress -------------------------------------------{{{

/* tslint:disable:object-literal-sort-keys */
export function* onRedeemableBevegramPress(action) {
  const selectedBevegramPackage: SelectedBevegramPackage = action.payload;
  yield put({
    type: "SET_REDEEM_RECEIVED_BEVEGRAM_ID",
    payload: {
      receivedBevegramId: selectedBevegramPackage.id,
    },
  });

  yield call(goToRoute, {
    payload: {
      route: "RedeemBeer",
      routeData: selectedBevegramPackage,
    },
  });
}
//  End onRedeemableBevegramPress ---------------------------------------}}}
//  onRedeemLocationSelected --------------------------------------------{{{

export function* onRedeemLocationSelected(action) {
  const loc: Location = action.payload.loc;
  const quantity: number = action.payload.quantity;
  // const selectedBevegramPackage: SelectedBevegramPackage = action.payload;
  yield put({
    type: "SET_REDEEM_LOCATION",
    payload: {
      loc,
    },
  });

  yield put({
    type: "SET_REDEEM_SELECTED_QUANTITY",
    payload: {
      quantity,
    },
  });

  yield call(goToRoute, {
    payload: {
      route: "RedeemVendorIdInput",
      routeData: {
        loc,
        quantity,
      },
    },
  });
}

//  End onRedeemLocationSelected ----------------------------------------}}}
//  verifyVendorId -----------------------------------------------------{{{

export function* verifyVendorId(action) {
  const inputId: string = action.payload.inputId;

  yield put({
    type: "SET_REDEEM_VENDOR_ID",
    payload: {
      inputId,
    },
  });

  const routeData = yield select<{ routes: RouteState }>(
    state => state.routes.RedeemVendorIdInput.data,
  );

  const currentLocation: Location = routeData.loc;

  const redeemableBevegramData = yield select<{ routes: RouteState }>(
    state => state.routes.RedeemBeer.data,
  );

  // The vendorId is the first four digits of the address, repeated if
  // necessary.
  const vendorId = currentLocation.address
    .split(" ")[0]
    .repeat(VENDOR_ID_LENGTH)
    .slice(0, VENDOR_ID_LENGTH);

  if (inputId.length === VENDOR_ID_LENGTH) {
    if (inputId === vendorId) {
      Keyboard.dismiss();
      yield put({ type: "SET_SUCCESSFUL_REDEEM_VENDOR_ID" });

      yield call(goToRoute, {
        payload: {
          route: "RedeemInProgress",
        },
      });

      yield put({
        type: "REDEEM_BEVEGRAM",
        payload: {
          loc: currentLocation,
          receivedId: redeemableBevegramData.id,
          quantity: redeemableBevegramData.quantity,
        },
      });
      yield put({ type: "CLEAR_REDEEM_VENDOR_ID" });
    } else {
      yield put({ type: "SHOW_VENDOR_ID_FAILED_BANNER" });
      yield put({ type: "SET_FAILED_REDEEM_VENDOR_ID" });
    }
  } else {
    yield put({ type: "SET_NEUTRAL_REDEEM_VENDOR_ID" });
    const bannerIsShown = yield select<{ banner: BannerProps }>(
      state => state.banner.show,
    );

    if (bannerIsShown) {
      yield put({ type: "DISMISS_BANNER" });
    }
  }
}

//  End verifyVendorId -------------------------------------------------}}}
