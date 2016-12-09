import { connect } from 'react-redux';

import { batchActions } from 'redux-batched-actions';

import { Actions } from 'react-native-router-flux';

import Login, {LoginProps} from '../components/Login';

interface StateProps {
  isLoggedIn: boolean;
}

const mapStateToProps = (state): StateProps => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  }
}

interface DispatchProps {
  onSuccessfulFacebookLogin(): void;
  requestFacebookData(token: string): void;

}

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    onSuccessfulFacebookLogin: () => {
      dispatch({type: 'SUCCESSFUL_FACEBOOK_LOGIN'});
      Actions["MainUi"]();
    },
    requestFacebookData: (token) => {
      dispatch({type: 'REQUEST_ALL_FACEBOOK_DATA', payload: {
        token: token,
      }});
    },
  }
}

const CLogin = connect<StateProps, DispatchProps, LoginProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

export default CLogin;
