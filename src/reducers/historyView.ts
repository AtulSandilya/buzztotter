interface HistoryViewState {
  isRefreshing: boolean;
  completedInitialLoad: boolean;
}

const initialState: HistoryViewState = {
  isRefreshing: false,
  completedInitialLoad: false,
}

export const historyView = (state: HistoryViewState = initialState, action) => {
  switch(action.type) {
    case "ATTEMPTING_HISTORY_UPDATE":
      return Object.assign({}, state, {
        isRefreshing: true,
      });
    case "SUCCESSFUL_HISTORY_UPDATE":
      return Object.assign({}, state, {
        isRefreshing: false,
      });
    default:
      return state;
  }
}
