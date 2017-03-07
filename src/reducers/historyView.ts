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
    default:
      return state;
  }
}
