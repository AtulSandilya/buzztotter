import {connect} from 'react-redux';

import FacebookLoginButton, {FacebookLoginButtonProps} from '../components/FacebookLoginButton';

interface MapStateProps {
  userIsLoggedIn?: boolean;
}

const mapStateToProps = (state) => {
  return {
    userIsLoggedIn: state.user.isLoggedIn,
  }
}

const CFacebookLoginButton = connect<MapStateProps, {}, FacebookLoginButtonProps>(
  mapStateToProps,
  undefined,
)(FacebookLoginButton);

export default CFacebookLoginButton;
