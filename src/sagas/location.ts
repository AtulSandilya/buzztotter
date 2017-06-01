import {
  call,
  put,
} from "redux-saga/effects";

import {delay} from "redux-saga";

import * as DbSchema from "../db/schema";

import {
  readNode,
} from "../api/firebase/index";

import {
  GpsCoordinates,
  Location,
} from "../db/tables";

import {
  CoordsAreInRadius,
  CoordsAreWithinViewport,
} from "../CommonUtilities";

const promiseDeviceGpsCoordinates = (): Promise<GpsCoordinates> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    }, null, {enableHighAccuracy: false, timeout: 20000, maximumAge: 1});
  });
};

function *getLocationsNearCoordinates(coords: GpsCoordinates) {
  const maxLocationsToRequest = 1000;
  const gpsCoordUrls = DbSchema.GetAllGpsCoordNodeUrls(coords);

  const summaryNodes = [];
  for (const gpsCoordUrl of gpsCoordUrls) {
    const nodeSummary = yield call(readNode, gpsCoordUrl.summaryUrl);
    summaryNodes.push(nodeSummary);
  }

  let nodeToPullPos = 0;
  summaryNodes.map((summary, index) => {
    if (summary && (summary.totalLocations > maxLocationsToRequest)) {
      nodeToPullPos = index;
    }
  });

  const locationsWithId = yield call(readNode, gpsCoordUrls[nodeToPullPos].listUrl);
  return locationsWithId;
}

/* tslint:disable:object-literal-sort-keys */
export function *getLocationsNearUser() {
  yield put({type: "ATTEMPTING_LOCATION_NEAR_USER_UPDATE"});

  const deviceCoordinates: GpsCoordinates = yield call(promiseDeviceGpsCoordinates);
  const locationsNearUser = yield call(getLocationsNearCoordinates, deviceCoordinates);

  const locationsAsList = Object.keys(locationsNearUser).map((key) => {
    return locationsNearUser[key];
  });

  yield put({type: "REFRESH_LOCATIONS", payload: {
    locations: locationsAsList,
  }});

  yield put({type: "SUCCESSFUL_LOCATION_NEAR_USER_UPDATE"});
}

export function *getLocationsAtUserLocation() {

  yield put({type: "ATTEMPTING_GET_LOCATIONS_AT_USER_LOCATION"});

  const locationFetchDelay = 2000;
  yield delay(locationFetchDelay);

  let deviceCoordinates: GpsCoordinates;
  try {
    deviceCoordinates = yield call(promiseDeviceGpsCoordinates);
  } catch (e) {
    yield put({type: "FAILED_GET_LOCATIONS_AT_USER_LOCATION", payload: {
      error: "Your gps is disabled!",
    }});
  }
  const gpsCoordUrls = DbSchema.GetAllGpsCoordNodeUrls(deviceCoordinates);
  const locationsAtUserLoc = yield call(readNode, gpsCoordUrls[gpsCoordUrls.length - 1].listUrl);

  if (!locationsAtUserLoc) {
    yield put({type: "FAILED_GET_LOCATIONS_AT_USER_LOCATION", payload: {
      error: "You are not at a location that accepts bevegrams",
    }});
    return;
  } else {
    const locationKeysAtUserLocation = Object.keys(locationsAtUserLoc).filter((key) => {
      const loc: Location = locationsAtUserLoc[key];
      const defaultSquareFootage = 2000; // ~ 25m radius
      const squareFootage = loc.squareFootage ? loc.squareFootage : defaultSquareFootage;

      return CoordsAreWithinViewport(
        deviceCoordinates,
        loc.viewport,
        ) && CoordsAreInRadius(deviceCoordinates, {latitude: loc.latitude, longitude: loc.longitude}, squareFootage);
    });

    if (locationKeysAtUserLocation.length === 0) {
      yield put({type: "FAILED_GET_LOCATIONS_AT_USER_LOCATION", payload: {
        error: "You are not at a location that accepts bevegrams",
      }});
      return;
    } else if (locationKeysAtUserLocation.length > 1) {
      yield put({type: "FAILED_GET_LOCATIONS_AT_USER_LOCATION", payload: {
        error: "Multiple bars were found at your location",
      }});
      return;
    } else {
      const loc = locationsAtUserLoc[locationKeysAtUserLocation[0]];
      yield put({type: "SUCCESSFUL_GET_LOCATIONS_AT_USER_LOCATION", payload: {
        location: loc,
      }});

      return Object.assign({}, loc, {
        vendorId: locationKeysAtUserLocation[0],
      });
    }

  }
};
