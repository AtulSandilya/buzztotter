import {CardResponseData} from './purchase';

interface UserState {
  isLoggedIn: boolean;
  facebook: {token: string, id: string};
  google: {token: string};
  firstName: string;
  lastName: string;
  fullName: string;
  birthday: string;
  email: string;
  stripe: {
    customerId: string,
    creditCards: CardResponseData[],
    activeCardId: string,
  };
}

const defaultState: UserState = {
  isLoggedIn: false,
  facebook: {
    token: undefined,
    id: undefined,
  },
  google: {
    token: undefined
  },
  firstName: undefined,
  lastName: undefined,
  fullName: undefined,
  birthday: undefined,
  email: undefined,
  stripe: {
    customerId: undefined,
    creditCards: [],
    activeCardId: undefined,
  }
}

const mapFacebookDataToState = (state, action): UserState => {
  const data = action.payload.userData;
  return Object.assign({}, state,
    {
      isLoggedIn: true,
      facebook: {
        token: action.payload.token,
        id: action.payload.userData.id,
      },
      firstName: data.first_name,
      lastName: data.last_name,
      fullName: data.name,
      birthday: data.birthday,
      email: data.email,
    }
  );
}

export const user = (state = defaultState, action): UserState => {
  switch(action.type){
    case('POPULATE_USER_DATA_FROM_FACEBOOK'):
      return mapFacebookDataToState(state, action);
    case('SUCCESSFUL_STRIPE_CUSTOMER_CREATION'):
      return Object.assign({}, state, {
          stripe: {
            customerId: action.payload.customerId,
            creditCards: [],
            activeCardId: undefined,
          }
        });
    case('SUCCESSFUL_STRIPE_CUSTOMER_UPDATE'):
      return Object.assign({}, state, {
          stripe: {
            activeCardId: action.payload.defaultCard,
            creditCards: action.payload.creditCards !== undefined ? action.payload.creditCards : [],
            customerId: state.stripe.customerId,
          }
        });
    case('SUCCESSFUL_STRIPE_CUSTOMER_VERIFICATION'):
      return Object.assign({}, state, {
          stripe: {
            activeCardId: action.payload.activeCard,
            creditCards: state.stripe.creditCards,
            customerId: state.stripe.customerId,
          }
        });
    case('SUCCESSFUL_STRIPE_ADD_CARD_TO_CUSTOMER'):
      return Object.assign({}, state, {
          stripe: {
            // Duplicate the array, adding the new card to the end
            creditCards: state.stripe.creditCards.concat(action.payload.newCard),
            customerId: state.stripe.customerId,
            activeCardId: state.stripe.activeCardId,
          }
        });
    case('SUCCESSFUL_STRIPE_REMOVE_CARD'):
      const index = action.payload.cardIndex;
      const newActiveCard = action.payload.newDefaultCard;
      return Object.assign({}, state, {
          stripe: {
            // Clone the array before and after the index, effectively
            // removing the index
            creditCards: state.stripe.creditCards.slice(0, index).concat(state.stripe.creditCards.slice(index + 1)),
            // If the card removed was the default card the active card is set
            // from the payload, otherwise don't change the active card
            activeCardId: newActiveCard ? newActiveCard : state.stripe.activeCardId,
            customerId: state.stripe.customerId,
          }
        });
    case('SUCCESSFUL_STRIPE_DEFAULT_CARD_UPDATE'):
      const newDefaultCard = action.payload.newDefaultCard;
      return Object.assign({}, state, {
          stripe: {
            creditCards: state.stripe.creditCards,
            customerId: state.stripe.customerId,
            activeCardId: newDefaultCard,
          }
        });
    case('UPDATE_STRIPE_DATA'):
      return Object.assign({}, state, {
          stripe: {
            creditCards: action.payload.creditCards,
            activeCardId: action.payload.defaultCard,
            customerId: state.stripe.customerId,
          }
        });
    case 'LOGOUT_FACEBOOK':
      return Object.assign({}, state,
        {
          isLoggedIn: false,
        }
      );
    default:
      return state;
  }
}
