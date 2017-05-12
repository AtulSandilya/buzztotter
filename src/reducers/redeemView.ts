import {
  GpsCoordinates,
  RedeemTransactionStatus,
} from "../db/tables";

interface RedeemViewState {
  currentLocation: GpsCoordinates,
  currentLocationBusinessName: string;
  lastModified: string;
  isRefreshingLocation: boolean;
  getLocationFailed: boolean;
  getLocationFailedErrorMessage?: string;
  isProcessing: boolean;
  redeemFailed: boolean;
  redeemTransactionStatus: RedeemTransactionStatus;
}

const initialState: RedeemViewState = {
  currentLocation: {
    longitude: undefined,
    latitude: undefined,
  },
  lastModified: undefined,
  currentLocationBusinessName: undefined,
  getLocationFailed: false,
  isProcessing: false,
  isRefreshingLocation: false,
  redeemFailed: false,
  redeemTransactionStatus: {
    connectionEstablished: "pending",
    updatingDatabase: "pending",
  },
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
    case "ATTEMPTING_GET_LOCATIONS_AT_USER_LOCATION":
      return Object.assign({}, state, {
        isRefreshingLocation: true,
      });
    case "FAILED_GET_LOCATIONS_AT_USER_LOCATION":
      return Object.assign({}, state, {
        isRefreshingLocation: false,
        getLocationFailed: true,
        getLocationFailedErrorMessage: action.payload.error,
      });
    case "SUCCESSFUL_GET_LOCATIONS_AT_USER_LOCATION":
      return Object.assign({}, state, {
        currentLocationBusinessName: action.payload.location.name,
        isRefreshingLocation: false,
      });
    case "ATTEMPTING_REDEEM":
      return Object.assign({}, state, {
        isProcessing: true,
      });
    case "UPDATE_REDEEM_TRANSACTION_STATUS":
      return  Object.assign({}, state, {
        redeemTransactionStatus: action.payload.redeemTransactionStatus,
      });
    case "FAILED_REDEEM_TRANSACTION":
      const newRedeemTransactionStatus = Object.assign({}, state.redeemTransactionStatus, {
        error: action.payload.error,
      });
      return  Object.assign({}, state, {
        redeemTransactionStatus: newRedeemTransactionStatus,
      });
    case "FINISHED_REDEEM":
      return Object.assign({}, state, {
        isProcessing: false,
      });
    case "RESET_REDEEM":
      return Object.assign({}, state, initialState);
    default:
      return state;
  }
}
