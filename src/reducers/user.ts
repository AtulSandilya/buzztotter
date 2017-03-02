import {CreditCard} from './purchase';

export interface FirebaseUser {
  displayName: string;
  email: string;
  emailVerified: boolean;
  photoURL: string;
  refreshToken: string;
  uid: string;
}

export interface UserState {
  isLoggedIn: boolean;
  bevegrams: number;
  facebook: {token: string, id: string};
  firstName: string;
  lastName: string;
  fullName: string;
  birthday: string;
  email: string;
  lastModified: string;
  fcmToken: string;
  stripe: {
    customerId: string,
    creditCards: CreditCard[],
    activeCardId: string,
  };
  firebase: FirebaseUser;
}

const defaultState: UserState = {
  isLoggedIn: false,
  bevegrams: 0,
  facebook: {
    token: undefined,
    id: undefined,
  },
  firstName: undefined,
  lastName: undefined,
  fullName: undefined,
  birthday: undefined,
  email: undefined,
  lastModified: null,
  fcmToken: null,
  stripe: {
    customerId: undefined,
    creditCards: [],
    activeCardId: undefined,
  },
  firebase: undefined,
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
    case 'LOGIN_FACEBOOK':
      return Object.assign({}, state, {
        isLoggedIn: true,
      });
    case 'LOGOUT_FACEBOOK':
      return Object.assign({}, state, {
        isLoggedIn: false,
      });
    case 'SUCCESSFUL_FIREBASE_LOGIN':
      return Object.assign({}, state, {
        firebase: action.payload.firebaseUser,
      })
    case 'UPDATE_USER_BEVEGRAMS':
      return Object.assign({}, state, {
        bevegrams: state.bevegrams + action.payload.newBevegrams,
      })
    case 'SUCCESSFUL_SEND_BEVEGRAM':
      return Object.assign({}, state, {
        bevegrams: state.bevegrams - action.payload.sentBevegrams,
      })
    case 'STORE_FCM_TOKEN':
      return Object.assign({}, state, {
        fcmToken: action.payload.fcmToken,
    })
    case 'UPDATE_LAST_MODIFIED':
      return Object.assign({}, state, {
        lastModified: action.payload.lastModified,
    })

    default:
      return state;
  }
}
