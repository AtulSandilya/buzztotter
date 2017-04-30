import {connect} from "react-redux";

import BevegramLocations, {BevegramLocationsProps} from "../components/BevegramLocations";
import {sceneKeys} from "../reducers/view";

import {Location} from "../db/tables";

interface StateProps {
  markers?: [Location];
  numRenders?: number;
}

const mapStateToProps = (state): StateProps => {
  return {
    markers: state.locations,
    // Somehow this prevents multiple renders of the MapView, this prop is
    // never used but its existence does something.
    numRenders: state.view.filter((item) => item === sceneKeys.bevegramLocations).length,
  };
};

const CBevegramLocations = connect<StateProps, {}, BevegramLocationsProps>(
  mapStateToProps,
  undefined,
)(BevegramLocations);

export default CBevegramLocations;
