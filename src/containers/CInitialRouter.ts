import { connect } from 'react-redux';

import InitialRouter, {InitialRouterProps} from '../routers/InitialRouter';

interface MapStateProps {
  showLogin?: boolean;
  isLoading?: boolean;
}

const mapStateToProps = (state): MapStateProps => {
  return {
    showLogin: !state.user.isLoggedIn,
    isLoading: state.app.isLoading,
  }
}

interface MapDispatchProps {
  goBackRoute?(): void;
}

const mapDispatchToProps = (dispatch) => {
  return {
    goBackRoute: () => {
      dispatch({type: 'GO_BACK_ROUTE'});
    }
  }
}

const CInitialRouter = connect<MapStateProps, MapDispatchProps, InitialRouterProps>(
  mapStateToProps,
  mapDispatchToProps,
)(InitialRouter);

export default CInitialRouter;
