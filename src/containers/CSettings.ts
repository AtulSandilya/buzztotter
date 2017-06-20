import { connect } from "react-redux";

import { Settings } from "../components/Settings";

const mapStateToProps = (state) => {
  return {
    fullName: state.user.fullName,
    location: state.settings.location,
    notifications: state.settings.notifications,
    version: require("../../package.json").version,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logoutActions: () => {
      dispatch({type: "REQUEST_LOGOUT", payload: {
        route: "Login",
      }});
    },
    toggleNotificationSetting: () => {
      dispatch({type: "TOGGLE_NOTIFICATION_SETTING"});
    },
    onSettingToggle: (inputKey) => {
      dispatch({type: "TOGGLE_SETTING", settingKey: inputKey});
    },
  };
};

const CSettings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);

export default CSettings;
