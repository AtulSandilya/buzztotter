import { connect } from "react-redux";

import LocationDetail, {LocationDetailProps} from "../components/LocationDetail";
import {Location} from "../db/tables";

interface StateProps {
  loc: Location;
}

const mapStateToProps = (state): StateProps => {
  return {
    loc: state.routes.LocationDetail.data,
  };
};

const CLocationDetail = connect<
  StateProps,
  {},
  LocationDetailProps
>(mapStateToProps)(LocationDetail);

export default CLocationDetail;
