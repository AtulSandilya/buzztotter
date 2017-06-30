interface LoginViewProps {
  inProgress: boolean;
}

const defaultState: LoginViewProps = {
  inProgress: false,
};

export const loginView = (state = defaultState, action): LoginViewProps => {
  switch (action.type) {
    case "LOGIN_IN_PROGRESS":
      return {
        ...state,
        inProgress: true,
      };
    case "LOGIN_COMPLETE":
      return {
        ...state,
        inProgress: false,
      };
    default:
      return state;
  }
};
