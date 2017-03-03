import { connect } from 'react-redux';

import RedeemBeer, {RedeemBeerProps} from '../components/RedeemBeer';

import {StringifyDate} from '../Utilities';
import {Location} from '../reducers/locations';
import {DeviceLocation} from '../reducers/redeemView';

interface StateProps {
  id?: string;
  name?: string;
  quantity?: number;
  currentLocation?: DeviceLocation;
  currentLocationBusinessName?: string;
  currentLocationLastModified?: string;
  getLocationFailed?: boolean;
  redeemConfirmed?: boolean;
  locations?: [Location];
}

const mapStateToProps = (state): StateProps => {
  return {
    id: state.routes.RedeemBeer.data.id,
    name: state.routes.RedeemBeer.data.from,
    quantity: state.routes.RedeemBeer.data.quantity,
    redeemConfirmed: state.routes.RedeemBeer.confirmed,
    locations: state.locations,
    currentLocation: state.redeemView.currentLocation,
    currentLocationBusinessName: state.redeemView.currentLocationBusinessName,
    currentLocationLastModified: state.redeemView.lastModified,
  }
}

interface DispatchProps {
  onRedeemClicked?(inputId: string): void;
  closeRedeem?(): void;
  updateLocation?(DeviceLocation): void;
}

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    onRedeemClicked: (inputId) => {
      dispatch({type: 'REDEEM_BEVEGRAM', bevegramId: inputId});
      dispatch({type: 'CONFIRM_ROUTE', route: "RedeemBeer"});
    },
    closeRedeem: () => {
      dispatch({type: 'GO_BACK_ROUTE'});
    },
    updateLocation: (input) => {
      dispatch({type: 'UPDATE_LOCATION', payload: {
        location: input.currentLocation,
        currentLocationBusinessName: input.currentLocationBusinessName,
        lastModified: StringifyDate(),
      }})
    }
  }
}

const CRedeemBeer = connect<StateProps, DispatchProps, RedeemBeerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(RedeemBeer);

export default CRedeemBeer;
