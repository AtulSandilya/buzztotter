import { connect } from "react-redux";

import Router, { RouterProps } from "../Router";

interface MapStateProps {
  showLogin?: boolean;
  isLoading?: boolean;
}

const mapStateToProps = (state): MapStateProps => {
  return {
    isLoading: state.app.isLoading,
    showLogin: !state.user.isLoggedIn,
  };
};

interface MapDispatchProps {
  goBackRoute?(): void;
}

const mapDispatchToProps = dispatch => {
  return {
    goBackRoute: () => {
      dispatch({ type: "GO_BACK_ROUTE" });
    },
  };
};

const CRouter = connect<MapStateProps, MapDispatchProps, RouterProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Router);

export default CRouter;
