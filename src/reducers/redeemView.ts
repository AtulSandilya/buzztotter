import { GpsCoordinates, RedeemTransactionStatus } from "../db/tables";

interface RedeemViewState {
  currentLocation: GpsCoordinates;
  currentLocationBusinessName: string;
  lastModified: string;
  isRefreshingLocation: boolean;
  getLocationFailed: boolean;
  getLocationFailedErrorMessage?: string;
  isProcessing: boolean;
  redeemFailed: boolean;
  redeemTransactionStatus: RedeemTransactionStatus;
  showGoToMapAlert: boolean;
}

const initialState: RedeemViewState = {
  currentLocation: {
    latitude: undefined,
    longitude: undefined,
  },
  currentLocationBusinessName: undefined,
  getLocationFailed: false,
  isProcessing: false,
  isRefreshingLocation: false,
  lastModified: undefined,
  redeemFailed: false,
  redeemTransactionStatus: {
    connectionEstablished: "pending",
    updatingDatabase: "pending",
  },
  showGoToMapAlert: false,
};

export const redeemView = (state: RedeemViewState = initialState, action) => {
  switch (action.type) {
    case "UPDATE_LOCATION": {
      return {
        ...state,
        currentLocation: action.payload.location,
        currentLocationBusinessName: action.payload.currentLocationBusinessName,
        getLocationFailed: action.payload.getLocationFailed,
        lastModified: action.payload.lastModified,
      };
    }
    case "ATTEMPTING_GET_LOCATIONS_AT_USER_LOCATION":
      return {
        ...state,
        isRefreshingLocation: true,
      };
    case "FAILED_GET_LOCATIONS_AT_USER_LOCATION":
      return {
        ...state,
        getLocationFailed: true,
        getLocationFailedErrorMessage: action.payload.error,
        isRefreshingLocation: false,
        showGoToMapAlert: action.payload.showGoToMapAlert ? true : false,
      };
    case "SUCCESSFUL_GET_LOCATIONS_AT_USER_LOCATION":
      return {
        ...state,
        currentLocationBusinessName: action.payload.location.name,
        isRefreshingLocation: false,
      };
    case "ATTEMPTING_REDEEM":
      return {
        ...state,
        isProcessing: true,
      };
    case "UPDATE_REDEEM_TRANSACTION_STATUS":
      return {
        ...state,
        redeemTransactionStatus: action.payload.redeemTransactionStatus,
      };
    case "FAILED_REDEEM_TRANSACTION":
      const newRedeemTransactionStatus = {
        ...state.redeemTransactionStatus,
        error: action.payload.error,
      };
      return {
        ...state,
        redeemTransactionStatus: newRedeemTransactionStatus,
      };
    case "FINISHED_REDEEM":
      return {
        ...state,
        isProcessing: false,
      };
    case "RESET_REDEEM":
      return { ...state, ...initialState };
    default:
      return state;
  }
};
