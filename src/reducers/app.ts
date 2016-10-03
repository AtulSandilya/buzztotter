const initialAppState = {
  isLoading: true,
}

export const app = (state = initialAppState, action) => {
  switch(action.type){
    case 'LOADING_COMPLETE':
      return {...state,
        isLoading: false,
      }
    default:
      return state;
  }
}
