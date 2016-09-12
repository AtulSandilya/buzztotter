import { connect } from 'react-redux';

import { Bevegram } from '../components/Bevegram';

const mapStateToProps = (state) => {
  return {
    modalIsOpen: state.modals.redeemBevegramModal.isOpen,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openModal: (inputKey, modalData) => {
      dispatch({type: 'OPEN_MODAL', modalKey: inputKey, dataForModal: modalData});
    },
    closeModal: (inputKey) => {
      dispatch({type: 'CLOSE_MODAL', modalKey: inputKey});
    },
  }
}

const CBevegram = connect(mapStateToProps, mapDispatchToProps)(Bevegram);

export default CBevegram;
