import { connect } from 'react-redux';

import Branding from '../components/Branding';

import {modalKeys} from '../reducers/modals';

const mapStateToProps = (state) => {
  return {
    settingsModalVisible: state.modals.settingsModal.isOpen,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openSettings: () => {
      dispatch({type: 'OPEN_MODAL', modalKey: modalKeys.settingsModal});
    },
    closeSettings: () => {
      dispatch({type: 'CLOSE_MODAL', modalKey: modalKeys.settingsModal});
    },
  }
}

const CBranding = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Branding);

export default CBranding;
