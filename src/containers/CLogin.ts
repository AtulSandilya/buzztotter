import { connect } from 'react-redux';

import { batchActions } from 'redux-batched-actions';

import { Actions } from 'react-native-router-flux';

import Login, {LoginProps} from '../components/Login';

interface StateProps {
  token: string,
  isLoggedIn: boolean;
}

const mapStateToProps = (state): StateProps => {
  return {
    token: state.user.facebook.token,
    isLoggedIn: state.user.isLoggedIn,
  }
}

interface DispatchProps {
  facebookLogin(token: string): void;
  googleLogin(): void;
}

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    facebookLogin: (token) => {
      dispatch({type: 'ALL_FACEBOOK_DATA_FETCH_REQUESTED', payload: {token: token}});
      Actions.mainScene();
    },
    googleLogin: () => {
      Actions.mainScene();
    }
  }
}

const CLogin = connect<StateProps, DispatchProps, LoginProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

export default CLogin;
