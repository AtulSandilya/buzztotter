import { connect } from "react-redux";

import RedeemBeer, { RedeemBeerProps } from "../components/RedeemBeer";
import { sceneKeys, sceneOrder } from "../reducers/view";

import { Location, ReceivedBevegram } from "../db/tables";

interface StateProps {
  id?: string;
  name?: string;
  isRefreshingLocation?: boolean;
  receivedBevegram?: ReceivedBevegram;
  pickerLocations?: Location[];
}

const mapStateToProps = (state): StateProps => {
  const receivedBevegramId = state.routes.RedeemBeer.data.id;
  return {
    id: state.routes.RedeemBeer.data.id,
    isRefreshingLocation: state.redeemPickerView.isRefreshingLocation,
    name: state.routes.RedeemBeer.data.from,
    pickerLocations: state.redeemPickerView.pickerLocations,
    receivedBevegram: state.receivedBevegrams[receivedBevegramId],
  };
};

interface DispatchProps {
  goToMap?(): void;
  updateLocation?(GpsCoordinates): void;
  selectLocation?(loc: Location, quantity: number): void;
}

/* tslint:disable:object-literal-sort-keys */
const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    goToMap: () => {
      dispatch({ type: "GO_BACK_ROUTE" });
      dispatch({
        type: "GOTO_VIEW",
        newScene: sceneOrder[sceneKeys.bevegramLocations],
      });
    },
    updateLocation: () => {
      dispatch({ type: "REQUEST_BAR_AT_USER_LOCATION" });
    },
    selectLocation: (loc: Location, quantity: number) => {
      dispatch({
        type: "ON_REDEEM_LOCATION_SELECTION",
        payload: {
          loc,
          quantity,
        },
      });
    },
  };
};

const CRedeemBeer = connect<StateProps, DispatchProps, RedeemBeerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(RedeemBeer);

export default CRedeemBeer;
