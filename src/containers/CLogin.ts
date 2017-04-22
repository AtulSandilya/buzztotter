import { connect } from "react-redux";

import { Actions } from "react-native-router-flux";

import Login, {LoginProps} from "../components/Login";

interface StateProps {
  isLoggedIn: boolean;
}

const mapStateToProps = (state): StateProps => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

interface DispatchProps {
  onSuccessfulFacebookLogin(): void;
  requestFacebookData(token: string): void;

}

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    onSuccessfulFacebookLogin: () => {
      dispatch({type: "SUCCESSFUL_FACEBOOK_LOGIN"});
      dispatch({type: "GO_TO_ROUTE", payload: {
        route: "MainUi",
      }});
    },
    requestFacebookData: (token) => {
      dispatch({type: "INITIALIZE_USER_DATA_WITH_FACEBOOK_TOKEN", payload: {
        token: token,
      }});
    },
  };
};

const CLogin = connect<StateProps, DispatchProps, LoginProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

export default CLogin;
