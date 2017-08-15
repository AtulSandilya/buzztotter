import { delay } from "redux-saga";
import { call, put, select } from "redux-saga/effects";

import store from "../configureStore";

import { readNode } from "../api/firebase/index";
import { MetersBetweenCoordinates } from "../CommonUtilities";
import { RedeemAlert } from "../components/RedeemBeer";
import { SortLocations } from "../containers/CBevegramLocations";
import * as DbSchema from "../db/schema";
import {
  DEFAULT_REDEEM_PICKER_LOCATIONS,
  GpsCoordinates,
  User,
} from "../db/tables";
import { Settings } from "../reducers/Settings";

/* tslint:disable:object-literal-sort-keys */
const getDeviceGpsCoordinates = (
  enableHighAccuracy: boolean = false,
): Promise<GpsCoordinates | undefined> => {
  const timeout = 5000;
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        resolve();
      },
      { enableHighAccuracy, timeout, maximumAge: 1 },
    );
  });
};

function* getLocationsNearCoordinates(coords: GpsCoordinates) {
  const maxLocationsToRequest = 1000;
  const gpsCoordUrls = DbSchema.GetAllGpsCoordNodeUrls(coords);

  const summaryNodes = [];
  for (const gpsCoordUrl of gpsCoordUrls) {
    const nodeSummary = yield call(readNode, gpsCoordUrl.summaryUrl);
    summaryNodes.push(nodeSummary);
  }

  let nodeToPullPos = 0;
  summaryNodes.map((summary, index) => {
    if (summary && summary.totalLocations > maxLocationsToRequest) {
      nodeToPullPos = index;
    }
  });

  const locationsWithId = yield call(
    readNode,
    gpsCoordUrls[nodeToPullPos].listUrl,
  );
  return locationsWithId;
}

export function* getLocationsNearUser() {
  yield put({ type: "ATTEMPTING_LOCATION_NEAR_USER_UPDATE" });

  const deviceCoordinates: GpsCoordinates = yield call(getDeviceGpsCoordinates);

  if (!deviceCoordinates) {
    yield put({ type: "FAILED_LOCATION_NEAR_USER_UPDATE" });
    return;
  }
  yield put({
    type: "STORE_LAST_USER_LOCATION",
    payload: {
      lastUserCoords: deviceCoordinates,
    },
  });

  const locationsNearUser = yield call(
    getLocationsNearCoordinates,
    deviceCoordinates,
  );

  const locationsAsList = Object.keys(locationsNearUser).map(key => {
    return locationsNearUser[key];
  });

  yield put({
    type: "REFRESH_LOCATIONS",
    payload: {
      locations: locationsAsList,
    },
  });

  yield put({ type: "SUCCESSFUL_LOCATION_NEAR_USER_UPDATE" });
}

let oneTimeLocationUsage = false;

export function* getLocationsAtUserLocation() {
  yield put({ type: "ATTEMPTING_GET_LOCATIONS_AT_USER_LOCATION" });
  const currentLocationSetting = yield select<{ settings: Settings }>(
    state => state.settings.location,
  );
  if (!currentLocationSetting && !oneTimeLocationUsage) {
    yield put({
      type: "FAILED_GET_LOCATIONS_AT_USER_LOCATION",
      payload: {
        error: "Unknown - Location setting is off!",
      },
    });

    RedeemAlert(
      "Redeeming requires your current location! Allow one time location usage?",
      [
        {
          text: "No",
          onPress: () => store.dispatch({ type: "GO_BACK_ROUTE" }),
        },
        {
          text: "Yes",
          onPress: () => {
            oneTimeLocationUsage = true;
            store.dispatch({ type: "REQUEST_BAR_AT_USER_LOCATION" });
          },
        },
      ],
    );
    return;
  }
  oneTimeLocationUsage = false;

  yield put({ type: "ATTEMPTING_REDEEM_PICKER_LOCATION_REFRESH" });

  const locationFetchMinMs = 3000;
  const locationFetchStart = Date.now();

  let deviceCoordinates: GpsCoordinates;
  try {
    // First try to get the device location with high accuracy, with a
    // fallback to low accuracy
    deviceCoordinates = yield call(getDeviceGpsCoordinates, true);
    if (!deviceCoordinates) {
      deviceCoordinates = yield call(getDeviceGpsCoordinates, false);
    }

    if (!deviceCoordinates) {
      throw new Error();
    }

    yield put({
      type: "STORE_LAST_USER_LOCATION",
      payload: {
        lastUserCoords: deviceCoordinates,
      },
    });

    const timeElapsed = Date.now() - locationFetchStart;
    if (timeElapsed < locationFetchMinMs) {
      yield delay(locationFetchMinMs - timeElapsed);
    }
  } catch (e) {
    yield put({
      type: "COMPLETED_REDEEM_PICKER_LOCATION_REFRESH",
    });
    return;
  }
  const gpsCoordUrls = DbSchema.GetAllGpsCoordNodeUrls(deviceCoordinates);

  // TODO: For now we pull every location. In the future we should pull locations
  // around the users location in a grid
  const locationsAtUserLoc = yield call(
    readNode,
    // gpsCoordUrls[gpsCoordUrls.length - 1].listUrl,
    gpsCoordUrls[0].listUrl,
  );

  const locationsWithVendorId = Object.keys(locationsAtUserLoc).map(key => {
    return {
      ...locationsAtUserLoc[key],
      vendorId: key,
    };
  });

  const locationsNearUser = SortLocations(
    locationsWithVendorId,
    deviceCoordinates,
    "nearToFar",
  );

  const locationsToShow = DEFAULT_REDEEM_PICKER_LOCATIONS;
  yield put({
    type: "UPDATE_REDEEM_PICKER",
    payload: {
      locations: locationsNearUser.slice(0, locationsToShow),
    },
  });
}

export function* userIsNearLastLocation() {
  const lastUserCoords = yield select<{ user: User }>(
    state => state.user.lastUserCoords,
  );
  const currentLocation = yield call(getDeviceGpsCoordinates);

  if (!currentLocation || !lastUserCoords) {
    return false;
  }

  const closeTogetherMeters = 75;
  return (
    MetersBetweenCoordinates(lastUserCoords, currentLocation) <
    closeTogetherMeters
  );
}
