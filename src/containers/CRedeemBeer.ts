import { connect } from 'react-redux';

import {batchActions} from 'redux-batched-actions';

import RedeemBeer, {RedeemBeerProps} from '../components/RedeemBeer';

import {Location} from '../reducers/locations';

interface StateProps {
  id: string;
  name: string;
  redeemConfirmed: boolean;
  locations: [Location];
}

const mapStateToProps = (state): StateProps => {
  return {
    id: state.modals.redeemBevegramModal.data.id,
    name: state.modals.redeemBevegramModal.data.from,
    redeemConfirmed: state.modals.redeemBevegramModal.confirmed,
    locations: state.locations,
  }
}

interface DispatchProps {
  onRedeemClicked(inputId: string): void;
}

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    onRedeemClicked: (inputId) => {
      dispatch(batchActions([
        {type: 'REDEEM_BEVEGRAM', bevegramId: inputId},
        {type: 'CONFIRM_MODAL', modalKey: 'redeemBevegramModal'},
      ]));
    }
  }
}

const CRedeemBeer = connect<StateProps, DispatchProps, RedeemBeerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(RedeemBeer);

export default CRedeemBeer;
