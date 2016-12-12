import { connect } from 'react-redux';

import { Settings } from '../components/Settings';

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
    logoutActions: () => {
      dispatch({type: 'REQUEST_LOGOUT', payload: {
        route: "Login"
      }})
    }
  }
}

const CSettings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);

export default CSettings;
