import { connect } from "react-redux";

import InitialRouter, { InitialRouterProps } from "../routers/InitialRouter";

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

const CInitialRouter = connect<
  MapStateProps,
  MapDispatchProps,
  InitialRouterProps
>(mapStateToProps, mapDispatchToProps)(InitialRouter);

export default CInitialRouter;
