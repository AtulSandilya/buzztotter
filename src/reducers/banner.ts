export type BannerStyle = "alert" | "success" | "message";

export interface BannerProps {
  dismiss: boolean;
  fontAwesomeIcon?: string;
  message: string;
  show: boolean;
  style: BannerStyle;
}

const defaultState: BannerProps = {
  dismiss: false,
  message: "",
  show: false,
  style: "message",
};

export const banner = (state = defaultState, action): BannerProps => {
  switch (action.type) {
    case "SHOW_ALERT_BANNER":
      return {
        ...state,
        message: action.payload.message,
        show: true,
        style: "alert",
      };
    case "SHOW_NO_INTERNET_CONNECTION_BANNER":
      return {
        ...state,
        message: "No Internet Connection",
        show: true,
        style: "alert",
      };
    case "SHOW_VENDOR_ID_FAILED_BANNER":
      return {
        ...state,
        message: "Incorrect Vendor Id",
        show: true,
        style: "alert",
      };
    case "HIDE_BANNER":
      return {
        ...state,
        dismiss: false,
        message: "",
        show: false,
      };
    case "DISMISS_BANNER":
      return {
        ...state,
        dismiss: true,
        message: "",
        show: false,
      };
    default:
      return state;
  }
};
