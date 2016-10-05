import { connect } from 'react-redux';

import Bevegram, {BevegramProps} from '../components/Bevegram';

interface DispatchProps {
  openModal?(inputKey: string, modalData: Object): void;
}

const mapDispatchToProps = (dispatch): DispatchProps  => {
  return {
    openModal: (inputKey, modalData) => {
      dispatch({type: 'OPEN_MODAL', modalKey: inputKey, dataForModal: modalData});
    },
  }
}

const CBevegram = connect<{}, DispatchProps, BevegramProps>(
  undefined,
  mapDispatchToProps
)(Bevegram);

export default CBevegram;
