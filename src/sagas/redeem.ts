import { call, put } from "redux-saga/effects";

import { goToRoute } from "./routes";

import { SelectedBevegramPackage } from "../components/Bevegram";
import { Location } from "../db/tables";

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
