import { connect } from 'react-redux';

import InitialRouter, {InitialRouterProps} from '../routers/InitialRouter';

interface StateProps {
  showLogin?: boolean;
  isLoading?: boolean;
}

const mapStateToProps = (state): StateProps => {
  return {
    showLogin: !state.user.isLoggedIn,
    isLoading: state.app.isLoading,
  }
}

const CInitialRouter = connect<StateProps, {}, InitialRouterProps>(
  mapStateToProps,
)(InitialRouter);

export default CInitialRouter;
