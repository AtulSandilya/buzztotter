import { sceneKeys, sceneOrder } from "./view";

interface BadgesState {
  unseenReceivedBevegrams: number;
  upcomingBirthdays: number;
}

const initialState: BadgesState = {
  unseenReceivedBevegrams: 0,
  upcomingBirthdays: 0,
};

export const badges = (state: BadgesState = initialState, action) => {
  switch (action.type) {
    case "ADD_RECEIVED_BEVEGRAM_TO_BADGE":
      return {
        ...state,
        unseenReceivedBevegrams:
          state.unseenReceivedBevegrams + action.payload.quantity,
      };
    case "RESET_BADGE":
      if (action.payload) {
        const newScenePosition = action.payload.newScenePosition;
        switch (newScenePosition) {
          case sceneOrder[sceneKeys.bevegrams]:
            return {
              ...state,
              unseenReceivedBevegrams: 0,
            };
          default:
            return state;
        }
      }
      return state;
    default:
      return state;
  }
};
