interface RedeemVendorIdViewProps {
  failed: boolean;
  inputId: string;
  successful: boolean;
}

const defaultState: RedeemVendorIdViewProps = {
  failed: false,
  inputId: "",
  successful: false,
};

export const redeemVendorIdView = (state = defaultState, action) => {
  switch (action.type) {
    case "SET_REDEEM_VENDOR_ID":
      return {
        ...state,
        failed: false,
        inputId: action.payload.inputId,
      };
    case "CLEAR_REDEEM_VENDOR_ID":
      return {
        ...state,
        failed: false,
        inputId: "",
        successful: false,
      };
    case "SET_FAILED_REDEEM_VENDOR_ID":
      return {
        ...state,
        failed: true,
        inputId: "",
      };
    case "SET_SUCCESSFUL_REDEEM_VENDOR_ID":
      return {
        ...state,
        failed: false,
        successful: true,
      };
    case "SET_NEUTRAL_REDEEM_VENDOR_ID":
      return {
        ...state,
        failed: false,
        successful: false,
      };
    default:
      return state;
  }
};
