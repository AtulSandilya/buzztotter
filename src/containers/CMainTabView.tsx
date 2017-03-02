import { connect } from 'react-redux';

import MainTabView, {MainViewRouterProps} from '../components/MainTabView';
import {sceneOrder} from '../reducers/view';

export interface TabIconBadges {
  Contacts: number;
  Bevegrams: number;
  Map: number;
  History: number;
}

interface StateProps {
  currentPage?: string;
  maxScene?: number;
  tabIconBadges?: TabIconBadges;
}

const mapStateToProps = (state): StateProps => {
  const sceneValues = Object.keys(sceneOrder).map(key => sceneOrder[key]);
  return {
    currentPage: state.view[0],
    // Get the highest value from sceneOrder
    maxScene: Math.max(...sceneValues),
    tabIconBadges: {
      Contacts: state.badges.upcomingBirthdays,
      Bevegrams: state.badges.unseenReceivedBevegrams,
      Map: 0,
      History: 0,
    }
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
      dispatch({type: 'RESET_BADGE', payload: {
        newScenePosition: newScenePos,
      }});
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
