import { connect } from 'react-redux';

import Bevegrams from '../components/Bevegrams';

const mapStateToProps = (state) => {
  return {
    bevegramsList: state.bevegrams,
    redeemModalIsOpen: state.modals.redeemBevegramModal.isOpen,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: (inputKey) => {
      dispatch({type: 'CLOSE_MODAL', modalKey: inputKey});
    },
  }
}

const CBevegrams = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Bevegrams);

export default CBevegrams;
