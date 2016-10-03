import { connect } from 'react-redux';

import MainViewRouter from '../routers/MainViewRouter.js';
import {sceneOrder} from '../reducers/view';

const mapStateToProps = (state) => {
  const sceneValues = Object.keys(sceneOrder).map(key => sceneOrder[key]);
  return {
    currentPage: state.view[0],
    // Get the highest value from sceneOrder
    maxScene: Math.max(...sceneValues),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onPageChange: (newScenePos) => {
      dispatch({type: 'GOTO_VIEW', newScene: newScenePos});
    },
    goBackPage: () => {
      dispatch({type: 'GOBACK_VIEW'});
    }
  }
}

const CMainViewRouter = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainViewRouter);

export default CMainViewRouter;
