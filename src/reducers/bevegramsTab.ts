const defaultState = {
  isLoadingBevegrams: false,
}

export const bevegramsTab = (state = defaultState, action) => {
  switch(action.type){
    case 'ATTEMPTING_UPDATE_RECEIVED_BEVEGRAMS':
      return Object.assign({}, state, {
        isLoadingBevegrams: true
      })
    case 'SUCCESSFUL_UPDATE_RECEIVED_BEVEGRAMS':
      return Object.assign({}, state, {
        isLoadingBevegrams: false,
      })
    default:
      return state;
  }
}
