import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';

import {batchActions} from 'redux-batched-actions';

import { Settings } from '../components/Settings';

import { modalKeys } from '../reducers/modals';

const mapStateToProps = (state) => {
  return {
    notifications: state.settings.notifications,
    location: state.settings.location,
    version: state.settings.version,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSettingToggle: (inputKey) => {
      dispatch({type: 'TOGGLE_SETTING', settingKey: inputKey});
    },
    onFacebookLogout: () => {
      dispatch(batchActions([
        {type: 'LOGOUT_FACEBOOK'},
        {type: 'CLOSE_MODAL', modalKey: modalKeys.settingsModal},
      ]));
      Actions["loginScene"]();
    }
  }
}

const CSettings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);

export default CSettings;
