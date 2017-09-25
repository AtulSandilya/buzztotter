interface BrandingTextProps {
  text: string;
}

const defaultState: BrandingTextProps = {
  text: "",
};

export const brandingText = (state = defaultState, action) => {
  switch (action.type) {
    case "SET_BRANDING_TEXT":
      return {
        ...state,
        text: action.payload.text,
      };
    case "RESET_BRANDING_TEXT":
      return defaultState;
    default:
      return state;
  }
};
