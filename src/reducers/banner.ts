export type BannerStyle = "alert" | "success" | "message";

export interface BannerProps {
  show: boolean;
  message: string;
  style: BannerStyle;
}

const defaultState: BannerProps = {
  message: "",
  show: false,
  style: "message",
};

export const banner = (state = defaultState, action): BannerProps => {
  switch (action.type) {
    case "SHOW_NO_INTERNET_CONNECTION_BANNER":
      return {
        ...state,
        message: "No Internet Connection",
        show: true,
        style: "alert",
      };
    case "HIDE_BANNER":
      return {
        ...state,
        show: false,
      };
    default:
      return state;
  }
};
