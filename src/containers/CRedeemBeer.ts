import { connect } from 'react-redux';

import RedeemBeer, {RedeemBeerProps} from '../components/RedeemBeer';

import {Location} from '../reducers/locations';

interface StateProps {
  id?: string;
  name?: string;
  redeemConfirmed?: boolean;
  locations?: [Location];
}

const mapStateToProps = (state): StateProps => {
  return {
    id: state.routes.RedeemBeer.data.id,
    name: state.routes.RedeemBeer.data.from,
    redeemConfirmed: state.routes.RedeemBeer.confirmed,
    locations: state.locations,
  }
}

interface DispatchProps {
  onRedeemClicked?(inputId: string): void;
  closeRedeem?(): void;
}

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    onRedeemClicked: (inputId) => {
      dispatch({type: 'REDEEM_BEVEGRAM', bevegramId: inputId});
      dispatch({type: 'CONFIRM_ROUTE', route: "RedeemBeer"});
    },
    closeRedeem: () => {
      dispatch({type: 'GO_BACK_ROUTE'});
    }
  }
}

const CRedeemBeer = connect<StateProps, DispatchProps, RedeemBeerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(RedeemBeer);

export default CRedeemBeer;
