import { connect } from 'react-redux';

import RedeemBeer, {RedeemBeerProps} from '../components/RedeemBeer';

import {StringifyDate} from '../CommonUtilities';
import {GpsCoordinates, Location} from '../db/tables';

interface StateProps {
  id?: string;
  name?: string;
  quantity?: number;
  currentLocation?: GpsCoordinates;
  currentLocationBusinessName?: string;
  currentLocationLastModified?: string;
  getLocationFailed?: boolean;
  redeemConfirmed?: boolean;
  isLoading?: boolean;
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
  onRedeemClicked?(quantity: number, receivedId: string): void;
  closeRedeem?(): void;
  updateLocation?(GpsCoordinates): void;
}

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    onRedeemClicked: (quantity, receivedId) => {
      dispatch({type: 'REDEEM_BEVEGRAM', payload: {
        quantity,
        receivedId,
      }});
    },
    closeRedeem: () => {
      dispatch({type: 'GO_BACK_ROUTE'});
    },
    updateLocation: () => {
      dispatch({type: 'REQUEST_BAR_AT_USER_LOCATION'});
    }
  }
}

const CRedeemBeer = connect<StateProps, DispatchProps, RedeemBeerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(RedeemBeer);

export default CRedeemBeer;
