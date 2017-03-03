export interface DeviceLocation {
  latitude: number,
  longitude: number,
}

interface RedeemViewState {
  currentLocation: DeviceLocation,
  currentLocationBusinessName: string;
  lastModified: string;
  getLocationFailed: boolean;
}

const initialState: RedeemViewState = {
  currentLocation: {
    longitude: undefined,
    latitude: undefined,
  },
  lastModified: undefined,
  currentLocationBusinessName: undefined,
  getLocationFailed: false,
}

export const redeemView = (state: RedeemViewState = initialState, action) => {
  switch(action.type){
    case 'UPDATE_LOCATION': {
      return Object.assign({}, state, {
        currentLocation: action.payload.location,
        currentLocationBusinessName: action.payload.currentLocationBusinessName,
        lastModified: action.payload.lastModified,
        getLocationFailed: action.payload.getLocationFailed,
      })
    }
    default:
      return state;
  }
}
