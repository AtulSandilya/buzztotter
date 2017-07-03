import { connect } from "react-redux";

import {
  PurchasedBevegram,
  ReceivedBevegram,
  SentBevegram,
} from "../db/tables";

import History, { HistoryProps } from "../components/History";

interface MapStateProps {
  bevegramHistoryKeys?: string[];
  purchasedBevegrams?: any;
  sentBevegrams?: any;
  receivedBevegrams?: any;
  redeemedBevegrams?: any;
  isRefreshing?: boolean;
  completedInitialLoad?: boolean;
}

const mergeKeys = (objects: any[]) => {
  const allKeys = [];
  objects.map(x => {
    const xKeys = Object.keys(x);
    if (xKeys.length > 0) {
      allKeys.push.apply(allKeys, xKeys);
    }
  });
  return allKeys;
};

const mapStateToProps = state => {
  return {
    bevegramHistoryKeys: mergeKeys([
      state.purchasedBevegrams.list,
      state.sentBevegrams.list,
      state.receivedBevegrams,
      state.redeemedBevegrams,
    ])
      .sort()
      .reverse(),
    completedInitialLoad: state.historyView.completedInitialLoad,
    isRefreshing: state.historyView.isRefreshing,
    purchasedBevegrams: state.purchasedBevegrams.list,
    receivedBevegrams: state.receivedBevegrams,
    redeemedBevegrams: state.redeemedBevegrams,
    sentBevegrams: state.sentBevegrams.list,
  };
};

interface MapDispatchProps {
  refreshHistory?(): void;
}

const mapDispatchToProps = dispatch => {
  return {
    refreshHistory: () => {
      dispatch({ type: "REFRESH_HISTORY" });
    },
  };
};

const CHistory = connect<MapStateProps, {}, HistoryProps>(
  mapStateToProps,
  mapDispatchToProps,
)(History);

export default CHistory;
