import { EventStatus, RedeemTransactionStatus } from "../db/tables";

export interface RedeemInProgressState {
  attempting: boolean;
  status: RedeemTransactionStatus;
}

const defaultState: RedeemInProgressState = {
  attempting: false,
  status: {
    connectionEstablished: "pending",
    locationVerified: "pending",
    updatingDatabase: "pending",
    vendorVerified: "complete",
  },
};

const updateStatus = (
  state: RedeemInProgressState,
  key: string,
  nextStatus: EventStatus,
) => {
  const newStatus = {
    ...state.status,
  };
  newStatus[key] = nextStatus;

  return {
    ...state,
    status: newStatus,
  };
};

export const redeemInProgressView = (
  state = defaultState,
  action,
): RedeemInProgressState => {
  switch (action.type) {
    case "ATTEMPTING_REDEEM":
      return {
        ...state,
        attempting: true,
      };
    case "ATTEMPTING_REDEEM_LOCATION_VERIFICATION":
      return updateStatus(state, "locationVerified", "inProgress");
    case "SUCCESSFUL_REDEEM_LOCATION_VERIFICATION":
      return updateStatus(state, "locationVerified", "complete");
    case "FAILED_REDEEM_LOCATION_VERIFICATION":
      return updateStatus(state, "locationVerified", "failed");
    case "ATTEMPTING_REDEEM_VENDOR_VERIFICATION":
      return updateStatus(state, "vendorVerified", "inProgress");
    case "SUCCESSFUL_REDEEM_VENDOR_VERIFICATION":
      return updateStatus(state, "vendorVerified", "complete");
    case "FAILED_REDEEM_VENDOR_VERIFICATION":
      return updateStatus(state, "vendorVerified", "failed");
    case "UPDATE_REDEEM_TRANSACTION_STATUS":
      if (action.payload.error && !action.payload.data) {
        return {
          ...state,
          status: {
            ...state.status,
            error: action.payload.error,
          },
        };
      }
      return {
        ...state,
        status: {
          ...state.status,
          ...action.payload.data,
        },
      };
    case "FINISHED_REDEEM":
      return {
        ...state,
        attempting: false,
      };
    case "RESET_REDEEM_IN_PROGRESS":
      return defaultState;
    default:
      return state;
  }
};
