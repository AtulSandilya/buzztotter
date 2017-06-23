import { connect } from "react-redux";

import BevegramLocations, { BevegramLocationsProps } from "../components/BevegramLocations";
import { settingsKeys } from "../reducers/settings";
import { sceneKeys } from "../reducers/view";

import { MetersBetweenCoordinates } from "../CommonUtilities";
import { GpsCoordinates, Location } from "../db/tables";

interface StateProps {
  markers?: Location[];
  numRenders?: number;
  isReloading?: boolean;
  locationFetchingAllowed?: boolean;
  userCoords?: GpsCoordinates;
}

const sortLocations = (
  locations: Location[],
  userCoords: GpsCoordinates,
  method: "nearToFar",
) => {
  switch (method) {
    case "nearToFar":
      if (!userCoords) {
        return locations;
      }

      const locationsWithDistanceFromUser = locations.map(loc => {
        return {
          ...loc,
          distanceFromUser: MetersBetweenCoordinates(userCoords, {
            latitude: loc.latitude,
            longitude: loc.longitude,
          }),
        };
      });

      return locationsWithDistanceFromUser.sort((a, b) => {
        if (a.distanceFromUser > b.distanceFromUser) {
          return 1;
        } else if (a.distanceFromUser === b.distanceFromUser) {
          return 0;
        }
        return -1;
      });
  }
};

const mapStateToProps = (state): StateProps => {
  return {
    isReloading: state.locationsView.isReloading,
    locationFetchingAllowed: state.settings.location,
    markers: sortLocations(
      state.locations,
      state.user.lastUserCoords,
      "nearToFar",
    ),
    // Somehow this prevents multiple renders of the MapView, this prop is
    // never used but its existence does something.
    numRenders: state.view.filter(item => item === sceneKeys.bevegramLocations)
      .length,
    userCoords: state.user.lastUserCoords,
  };
};

interface MapDispatchProps {
  getNearestLocations?(): void;
  toggleLocationSetting?(): void;
  goToLocationDetail?(loc: Location): void;
}

const mapDispatchToProps = dispatch => {
  return {
    getNearestLocations: () => {
      dispatch({ type: "REQUEST_LOCATIONS_NEAR_USER" });
    },
    goToLocationDetail: (loc: Location) => {
      dispatch({
        type: "GO_TO_ROUTE",
        payload: {
          route: "LocationDetail",
          routeData: loc,
        },
      });
    },
    toggleLocationSetting: () => {
      dispatch({ type: "TOGGLE_SETTING", settingKey: settingsKeys.location });
    },
  };
};

const CBevegramLocations = connect<
  StateProps,
  MapDispatchProps,
  BevegramLocationsProps
>(mapStateToProps, mapDispatchToProps)(BevegramLocations);

export default CBevegramLocations;
