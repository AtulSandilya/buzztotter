import { connect } from "react-redux";

import { Actions } from "react-native-router-flux";

import Login, {LoginProps} from "../components/Login";

interface StateProps {
  loginInProgress: boolean;
}

const mapStateToProps = (state): StateProps => {
  return {
    loginInProgress: state.loginView.inProgress,
  };
};

interface DispatchProps {
  requestLogin(): void;

}

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    requestLogin: () => {
      dispatch({type: "LOGIN"});
    },
  };
};

const CLogin = connect<StateProps, DispatchProps, LoginProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

export default CLogin;
