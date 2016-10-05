import { connect } from 'react-redux';

import Bevegrams, {BevegramsProps} from '../components/Bevegrams';

import {Bevegram} from '../reducers/bevegrams';

interface StateProps {
  bevegramsList?: [Bevegram];
  redeemModalIsOpen?: boolean;
}

const mapStateToProps = (state): StateProps => {
  return {
    bevegramsList: state.bevegrams,
    redeemModalIsOpen: state.modals.redeemBevegramModal.isOpen,
  }
}

interface DispatchProps {
  closeModal?(string): void;
}

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    closeModal: (inputKey) => {
      dispatch({type: 'CLOSE_MODAL', modalKey: inputKey});
    },
  }
}

const CBevegrams = connect<StateProps, DispatchProps, BevegramsProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Bevegrams);

export default CBevegrams;
