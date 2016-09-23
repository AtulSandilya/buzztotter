import { connect } from 'react-redux';

import { batchActions } from 'redux-batched-actions';

import { Actions } from 'react-native-router-flux';

import Login from '../components/Login';

const mapStateToProps = (state) => {
  return {
    token: state.user.facebook.token,
    isLoggedIn: state.user.isLoggedIn,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    facebookLogin: (token) => {
      dispatch({type: 'USER_FETCH_REQUESTED', payload: {token: token}});
      Actions.mainScene();
    },
    googleLogin: () => {
      Actions.mainScene();
    }
  }
}

const CLogin = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

export default CLogin;
