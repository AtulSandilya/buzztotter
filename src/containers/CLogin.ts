import { connect } from "react-redux";

import Login, { LoginProps } from "../components/Login";
import { routeKeys } from "../reducers/routes";

interface StateProps {
  loginInProgress: boolean;
}

const mapStateToProps = (state): StateProps => {
  return {
    loginInProgress: state.loginView.inProgress,
  };
};

interface DispatchProps {
  goToTermsAndConditions: () => void;
  requestLogin: () => void;
}

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    goToTermsAndConditions: () => {
      dispatch({
        type: "GO_TO_ROUTE",
        payload: {
          route: routeKeys.TermsAndConditions,
        },
      });
    },
    requestLogin: () => {
      dispatch({ type: "LOGIN" });
    },
  };
};

const CLogin = connect<StateProps, DispatchProps, LoginProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

export default CLogin;
