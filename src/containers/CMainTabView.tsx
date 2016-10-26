import { connect } from 'react-redux';

import MainTabView, {MainViewRouterProps} from '../components/MainTabView';
import {sceneOrder} from '../reducers/view';

interface StateProps {
  currentPage?: string;
  maxScene?: number;
}

const mapStateToProps = (state): StateProps => {
  const sceneValues = Object.keys(sceneOrder).map(key => sceneOrder[key]);
  return {
    currentPage: state.view[0],
    // Get the highest value from sceneOrder
    maxScene: Math.max(...sceneValues),
  }
}

interface DispatchProps {
  onPageChange?(number): void;
  goBackPage?(): void;
}

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    onPageChange: (newScenePos) => {
      dispatch({type: 'GOTO_VIEW', newScene: newScenePos});
    },
    goBackPage: () => {
      dispatch({type: 'GOBACK_VIEW'});
    }
  }
}

const CMainViewRouter = connect<StateProps, DispatchProps, MainViewRouterProps>(
  mapStateToProps,
  mapDispatchToProps,
)(MainTabView);

export default CMainViewRouter;
