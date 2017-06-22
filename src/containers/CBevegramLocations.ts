import { connect } from "react-redux";

import BevegramLocations, { BevegramLocationsProps } from "../components/BevegramLocations";
import { settingsKeys } from "../reducers/settings";
import { sceneKeys } from "../reducers/view";

import { Location } from "../db/tables";

interface StateProps {
  markers?: [Location];
  numRenders?: number;
  isReloading?: boolean;
  locationFetchingAllowed?: boolean;
}

const mapStateToProps = (state): StateProps => {
  return {
    isReloading: state.locationsView.isReloading,
    locationFetchingAllowed: state.settings.location,
    markers: state.locations,
    // Somehow this prevents multiple renders of the MapView, this prop is
    // never used but its existence does something.
    numRenders: state.view.filter(item => item === sceneKeys.bevegramLocations)
      .length,
  };
};

interface MapDispatchProps {
  getNearestLocations?(): void;
  toggleLocationSetting?(): void;
}

const mapDispatchToProps = dispatch => {
  return {
    getNearestLocations: () => {
      dispatch({ type: "REQUEST_LOCATIONS_NEAR_USER" });
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
