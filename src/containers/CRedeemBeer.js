import { connect } from 'react-redux';

import {batchActions} from 'redux-batched-actions';

import RedeemBeer from '../components/RedeemBeer';

const mapStateToProps = (state) => {
  return {
    id: state.modals.redeemBevegramModal.data.id,
    name: state.modals.redeemBevegramModal.data.from,
    redeemConfirmed: state.modals.redeemBevegramModal.confirmed,
    locations: state.locations,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onRedeemClicked: (inputId) => {
      dispatch(batchActions([
        {type: 'REDEEM_BEVEGRAM', bevegramId: inputId},
        {type: 'CONFIRM_MODAL', modalKey: 'redeemBevegramModal'},
      ]));
    }
  }
}

const CRedeemBeer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RedeemBeer);

export default CRedeemBeer;
