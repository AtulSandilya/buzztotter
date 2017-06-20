import { sceneKeys, sceneOrder } from "./view";

interface BadgesState {
  unseenReceivedBevegrams: number;
  upcomingBirthdays: number;
  resetBadgeOnNextClick: boolean;
}

const initialState: BadgesState = {
  resetBadgeOnNextClick: false,
  unseenReceivedBevegrams: 0,
  upcomingBirthdays: 0,
};

const sceneStack = [];

export const badges = (state: BadgesState = initialState, action) => {
  switch (action.type) {
    case "ADD_RECEIVED_BEVEGRAM_TO_BADGE":
      return {
        ...state,
        unseenReceivedBevegrams:
          state.unseenReceivedBevegrams + action.payload.quantity,
      };
    case "RESET_BADGE":
      const newScenePosition = action.payload.newScenePosition;
      if (newScenePosition !== sceneStack[0]) {
        sceneStack.unshift(newScenePosition);
      }

      if (
        state.resetBadgeOnNextClick ||
        (sceneStack.length >= 1 &&
          sceneStack[1] === sceneOrder[sceneKeys.bevegrams])
      ) {
        return {
          ...state,
          unseenReceivedBevegrams: 0,
        };
      } else {
        return state;
      }

    case "RESET_BADGE_ON_NEXT_CLICK":
      return {
        ...state,
        resetBadgeOnNextClick: true,
      };
    default:
      return state;
  }
};
