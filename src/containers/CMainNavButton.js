import { connect } from 'react-redux';

import MainNavButton from '../components/MainNavButton';

const mapStateToProps = (state) => {
  return {
    activeScene: state.view[0],
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onButtonPress: (nextViewKey) => {
      dispatch({type: 'GOTO_VIEW', newScene: nextViewKey});
    },
  }
}

const CMainViewButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainNavButton);

export default CMainViewButton;
