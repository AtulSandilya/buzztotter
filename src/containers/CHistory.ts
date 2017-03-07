import { connect } from 'react-redux';

import {
  PurchasedBevegram,
  SentBevegram,
  ReceivedBevegram,
  RedeemedBevegram,
} from '../db/tables';

import History, {HistoryProps} from '../components/History';

interface MapStateProps {
  bevegramHistoryKeys?: string[];
  purchasedBevegrams?: any;
  sentBevegrams?: any;
  receivedBevegrams?: any;
  redeemedBevegrams?: any;
  isRefreshing?: boolean;
  completedInitialLoad?: boolean;
}

const mergeKeys = (objects: Object[]) => {
  let keys = [];
  objects.map((x) => {
    keys.push.apply(keys, Object.keys(x));
  })
  return keys;
}

const mapStateToProps = (state) => {
  return {
    bevegramHistoryKeys: mergeKeys([
      state.purchasedBevegrams.list,
      state.sentBevegrams.list,
      state.receivedBevegrams,
      state.redeemedBevegrams,
    ]).sort().reverse(),
    purchasedBevegrams: state.purchasedBevegrams.list,
    sentBevegrams: state.sentBevegrams.list,
    receivedBevegrams: state.receivedBevegrams,
    redeemedBevegrams: state.redeemedBevegrams,
    isRefreshing: state.historyView.isRefreshing,
    completedInitialLoad: state.historyView.completedInitialLoad,
  }
}

interface MapDispatchProps {
  refreshHistory?(): void;
}

const mapDispatchToProps = (dispatch) => {
  return {
    refreshHistory: () => {
      dispatch({type: 'REFRESH_HISTORY'});
    }
  }
}

const CHistory = connect<MapStateProps, {}, HistoryProps>(
  mapStateToProps,
  mapDispatchToProps,
)(History);

export default CHistory;
