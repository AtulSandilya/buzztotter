interface HistoryViewState {
  isRefreshing: boolean;
  completedInitialLoad: boolean;
}

const initialState: HistoryViewState = {
  completedInitialLoad: false,
  isRefreshing: false,
};

export const historyView = (state: HistoryViewState = initialState, action) => {
  switch (action.type) {
    case "ATTEMPTING_HISTORY_UPDATE":
      return {
        ...state,
        isRefreshing: true,
      };
    case "SUCCESSFUL_HISTORY_UPDATE":
      return {
        ...state,
        isRefreshing: false,
      };
    default:
      return state;
  }
};
