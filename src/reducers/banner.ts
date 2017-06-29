export type BannerTypes = "alert" | "success" | "message";

export interface BannerProps {
  show: boolean;
  message: string;
  type: BannerTypes;
}

const defaultState: BannerProps = {
  message: "",
  show: false,
  type: "message",
};

export const banner = (state = defaultState, action): BannerProps => {
  switch (action.type) {
    case "SHOW_NO_INTERNET_CONNECTION_BANNER":
      return {
        ...state,
        message: "No Internet Connection",
        show: true,
        type: "alert",
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
