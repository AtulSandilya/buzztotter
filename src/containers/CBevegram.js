import { connect } from 'react-redux';

import Bevegram from '../components/Bevegram';

const mapDispatchToProps = (dispatch) => {
  return {
    openModal: (inputKey, modalData) => {
      dispatch({type: 'OPEN_MODAL', modalKey: inputKey, dataForModal: modalData});
    },
  }
}

const CBevegram = connect(
  undefined,
  mapDispatchToProps
)(Bevegram);

export default CBevegram;
