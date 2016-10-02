import { connect } from 'react-redux';

import InitialRouter from '../routers/InitialRouter';

const mapStateToProps = (state) => {
  return {
    showLogin: !state.user.isLoggedIn,
    isLoading: state.app.isLoading,
  }
}

const CInitialRouter = connect(
  mapStateToProps,
)(InitialRouter);

export default CInitialRouter;
