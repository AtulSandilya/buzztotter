export type BannerTypes = "alert" | "success" | "message";

export interface BannerProps {
  isVisible: boolean;
  message: string;
  type: BannerTypes;
}

interface BannersState {
  NoInternetConnectionBanner: BannerProps;
}

const defaultState: BannersState = {
  NoInternetConnectionBanner: {
    isVisible: false,
    message: "No Internet Connection",
    type: "alert",
  },
};

export const banners = (state = defaultState, action): BannersState => {
  switch (action.type) {
    case "SHOW_NO_INTERNET_CONNECTION_BANNER":
      return {
        ...state,
        NoInternetConnectionBanner: setVisibleStateForBanner(state.NoInternetConnectionBanner, true),
      };
    case "HIDE_NO_INTERNET_CONNECTION_BANNER":
      return {
        ...state,
        NoInternetConnectionBanner: setVisibleStateForBanner(state.NoInternetConnectionBanner, false),
      };
    default:
      return state;
  }
};

const setVisibleStateForBanner = (thisBanner: BannerProps, visibleState: boolean) => {
  return {
    ...thisBanner,
    isVisible: visibleState,
  };
};
