const initialAppState = {
  isLoading: true,
}

export const app = (state = initialAppState, action) => {
  switch(action.type){
    case 'LOADING_COMPLETE':
      return Object.assign({}, state,
        {
          isLoading: false
        }
      );
    default:
      return state;
  }
}
