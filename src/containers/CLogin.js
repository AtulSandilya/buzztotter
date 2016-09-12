import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';

import Login from '../components/Login';

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.login.isLoggedIn,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logInAction: () => {
      dispatch({type: 'LOG_IN'});
      Actions.mainScene();
    },
  }
}

const CLogin = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

export default CLogin;
