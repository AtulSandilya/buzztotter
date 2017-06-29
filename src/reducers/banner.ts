export type BannerTypes = "alert" | "success" | "message";

export interface BannerProps {
  isVisible: boolean;
  message: string;
  type: BannerTypes;
}

const defaultState: BannerProps = {
  isVisible: false,
  message: "",
  type: "message",
};

export const banner = (state = defaultState, action): BannerProps => {
  switch (action.type) {
    case "SHOW_NO_INTERNET_CONNECTION_BANNER":
      return {
        ...state,
        isVisible: true,
        message: "No Internet Connection",
        type: "alert",
      };
    case "HIDE_BANNER":
      return {
        ...state,
        isVisible: false,
      };
    default:
      return state;
  }
};
