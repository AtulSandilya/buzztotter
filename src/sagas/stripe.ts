import { call, put, select } from 'redux-saga/effects';

import {Alert} from 'react-native';

import { CreditCard, PurchaseData } from '../reducers/purchase';
import { CardDataForVerification } from '../reducers/addCreditCard';

import { goBackRoute } from './routes';

import {
  promiseAddCardToCustomer,
  promiseCreditCardPurchase,
  promiseCreditCardToken,
  promiseCustomer,
  promiseDeleteCustomerCard,
  promiseNewCustomer,
  promiseUpdateCustomerDefaultCard,
} from '../api/stripe';

//  fetchVerifyCreditCard -----------------------------------------------{{{

export function* fetchVerifyCreditCard(action){
  //If this user is not a stripe customer, create a new stripe customer
  let customerId: string = yield select((state) => state.user.stripe.customerId);
  if(customerId === undefined){
    customerId = yield call(fetchNewCustomer, {});
  }

  const cardData: CardDataForVerification = action.payload.cardData;
  try{
    yield put({type: 'ATTEMPTING_CREDIT_CARD_VERIFICATION'});

    const creditCardTokenResponse = yield call(promiseCreditCardToken, cardData.cardNumber, cardData.cardExpMonth, cardData.cardExpYear, cardData.cardCvc);

    yield call(checkResponseForError, creditCardTokenResponse, 'FAILED_CREDIT_CARD_VERIFICATION');

    yield call(fetchAddCardToCustomer, {token: creditCardTokenResponse.id});

    let currentRoute = yield select((state) => state.routes.currentRoute);
    if(currentRoute === "AddCreditCard"){
      yield call(goBackRoute, {});
    } else {
      yield put({type: 'END_CREDIT_CARD_VERIFICATION'});
    }

    yield put({type: 'SUCCESSFUL_CREDIT_CARD_VERIFICATION'});
  } catch(e){
    yield put({type: 'THROWN_CREDIT_CARD_VERIFICATION', payload: {
      error: e.message,
    }});
  }
}

//  End fetchVerifyCreditCard -------------------------------------------}}}
//  fetchNewCustomer ----------------------------------------------------{{{

function *fetchNewCustomer(action) {
  yield put({type: 'ATTEMPTING_STRIPE_CUSTOMER_CREATION'});
  try{

  // Directly accessing this information is much simpler than requesting and
  // passing to here from the state.
  const fullName: string = yield select((state) => state.user.fullName);
  const email: string = yield select((state) => state.user.email);
  const newCustomerResponse = yield call(promiseNewCustomer, fullName, email);
  yield call(checkResponseForError, newCustomerResponse, 'FAILED_STRIPE_CUSTOMER_CREATION');

  yield put({type: 'SUCCESSFUL_STRIPE_CUSTOMER_CREATION', payload: {
    customerId: newCustomerResponse.id,
  }})

  return newCustomerResponse.id;

  } catch(e){
    yield put({type: 'FAILED_STRIPE_CUSTOMER_CREATION'});
  }
}

//  End fetchNewCustomer ------------------------------------------------}}}
//  fetchAddCardToCustomer ----------------------------------------------{{{

// Adds a credit card, but does not make it the default
export function *fetchAddCardToCustomer(action){
  yield put({type: 'ATTEMPTING_STRIPE_ADD_CARD_TO_CUSTOMER'});
  try {
    const customerId: string = yield select((state) => state.user.stripe.customerId);
    const addCardToCustomerResponse = yield call(promiseAddCardToCustomer, customerId, action.token);
    yield call(checkResponseForError, addCardToCustomerResponse, 'FAILED_STRIPE_ADD_CARD_TO_CUSTOMER');

    yield call(fetchUpdateDefaultCard, {payload: {
      newDefaultCard: addCardToCustomerResponse.id,
    }})


    yield put({type: 'SUCCESSFUL_STRIPE_ADD_CARD_TO_CUSTOMER', payload: {
      newCard: addCardToCustomerResponse,
    }})

  } catch(e) {
    yield put({type: 'THROWN_STRIPE_ADD_CARD_TO_CUSTOMER', payload: {
      error: e.message,
    }});

    // On Purpose rethrow, this function is always called from a parent
    // usually fetchVerifyCreditCard, which must be halted.
    throw Error;
  }
}

//  End fetchAddCardToCustomer ------------------------------------------}}}
//  fetchVerifyCustomer -------------------------------------------------{{{

// Update the active card, verify that the cards in the state match the cards
// stripe has registered
export function *fetchVerifyCustomer() {
  yield put({type: 'ATTEMPTING_STRIPE_CUSTOMER_VERIFICATION'});

  try {
    const cardsInState = yield select((state) => state.user.stripe.creditCards);
    const customerId: string = yield select((state) => state.user.stripe.customerId);

    const customerResponse = yield call(promiseCustomer, customerId);
    yield call(checkResponseForError, customerResponse, 'FAILED_STRIPE_CUSTOMER_VERIFICATION');

    const cardsInStripe = customerResponse.sources.data;

    if(verifyCardListsMatch(cardsInState, cardsInStripe)){
      yield put({type: 'SUCCESSFUL_STRIPE_CUSTOMER_VERIFICATION', payload: {
        activeCard: customerResponse.default_source,
      }})
      return true;
    } else {
      yield put({type: 'SUCCESSFUL_STRIPE_CUSTOMER_UPDATE', payload: {
        defaultCard: customerResponse.default_source,
        creditCards: customerResponse.sources.data,
      }})
      return false;
    }

  } catch(e) {
    yield put({type: 'FAILED_STRIPE_CUSTOMER_VERIFICATION'});
  }
}

//  End fetchVerifyCustomer ---------------------------------------------}}}
//  verifyCardListsMatch ------------------------------------------------{{{

function verifyCardListsMatch(cardsInState, cardsInStripe): boolean {
  let stateIds = cardsInState.map((card) => card.id);
  stateIds.sort();

  let stripeIds = cardsInStripe.map((card) => card.id);
  stripeIds.sort();

  if(stateIds.length === stripeIds.length){
    for(const id in stateIds){
      if(stateIds[id] !== stripeIds[id]){
        return false;
      }
    }
    return true;
  }

  return false;
}

//  End verifyCardListsMatch --------------------------------------------}}}
//  fetchUpdateDefaultCard ----------------------------------------------{{{

export function *fetchUpdateDefaultCard(action){
  try {
    yield put({type: 'ATTEMPTING_STRIPE_DEFAULT_CARD_UPDATE'});

    const customerId: string = yield select((state) => state.user.stripe.customerId);
    const updateDefaultCardResponse = yield call(promiseUpdateCustomerDefaultCard, customerId, action.payload.newDefaultCard);
    yield call(checkResponseForError, updateDefaultCardResponse, 'FAILED_STRIPE_DEFAULT_CARD_UPDATE');

    yield put({type: 'SUCCESSFUL_STRIPE_DEFAULT_CARD_UPDATE', payload: {
      newDefaultCard: action.payload.newDefaultCard,
    }});

    yield put({type: 'RENDER_SUCCESSFUL_STRIPE_DEFAULT_CARD_UPDATE'});
  } catch(e) {
    yield put({type: 'FAILED_STRIPE_DEFAULT_CARD_UPDATE'});
  }
}

//  End fetchUpdateDefaultCard ------------------------------------------}}}
//  fetchCreditCardPurchase ---------------------------------------------{{{

export function* fetchCreditCardPurchase(action) {
    const purchaseData = action.payload.purchaseData;
    try{
      yield put({type: 'ATTEMPTING_CREDIT_CARD_PURCHASE'});

      // Before a purchase verify that the customer in the state matches the
      // customer registered in stripe. If they don't match abort the
      // transaction, alert the user, update the state with the correct data
      // and return to the purchase view.
      const customerIsVerified = yield call(fetchVerifyCustomer);
      if(!customerIsVerified){
        // It is a much easier to render this alert here than through the
        // state, where it is difficult to prevent duplicate renders when the
        // state is updating rapidly.
        Alert.alert(
          "Purchase Error",
          "Error processing purchase! Please try again!",
          [{text: 'Try Again'}]
        );
        yield put({type: 'RESET_CREDIT_CARD_PURCHASE'})
        return;
      }

      // Continue with the purchase.
      const customerId: string = yield select((state) => state.user.stripe.customerId);
      const creditCardPurchaseResponse = yield call(promiseCreditCardPurchase, customerId, purchaseData.amount, purchaseData.description);
      yield call(checkResponseForError, creditCardPurchaseResponse, 'FAILED_CREDIT_CARD_PURCHASE');

      yield put({type: 'SUCCESSFUL_CREDIT_CARD_PURCHASE', payload: creditCardPurchaseResponse});
      yield put({type: 'UPDATE_USER_BEVEGRAMS', payload: {
        newBevegrams: purchaseData.quantity,
      }})
      return creditCardPurchaseResponse.id;
    } catch(e) {
      yield put({type: 'HANDLE_CREDIT_CARD_FAILED', payload: e.message});
    }
}

//  End fetchCreditCardPurchase -----------------------------------------}}}
//  fetchDeleteCustomerCard ---------------------------------------------{{{

export function *fetchDeleteCustomerCard(action){
  try {
    yield put({type: 'ATTEMPTING_STRIPE_REMOVE_CARD'});
    const customerId: string = yield select((state) => state.user.stripe.customerId);
    const deleteCustomerCardResponse = yield call(promiseDeleteCustomerCard, customerId, action.payload.cardToDelete);
    yield call(checkResponseForError, deleteCustomerCardResponse, 'FAILED_STRIPE_REMOVE_CARD');

    // If the card we are deleting is the default card, set the first card in
    // the credit card list as the default card
    const activeCard: string = yield select((state) => state.user.stripe.activeCardId);
    const creditCards = yield select((state) => state.user.stripe.creditCards);
    if(activeCard === action.payload.cardToDelete && creditCards.length > 1){
      const newDefaultCard = creditCards[0].id;
      const updateDefaultCardResponse = yield call(promiseUpdateCustomerDefaultCard, customerId, newDefaultCard);
      yield call(checkResponseForError, updateDefaultCardResponse, 'FAILED_STRIPE_DEFAULT_CARD_UPDATE');

      yield put({type: 'SUCCESSFUL_STRIPE_REMOVE_CARD', payload: {
        newDefaultCard: newDefaultCard,
        cardIndex: action.payload.cardIndex,
      }});
    } else {
      yield put({type: 'SUCCESSFUL_STRIPE_REMOVE_CARD', payload: {
        cardIndex: action.payload.cardIndex,
      }});
    }

    yield call(fetchVerifyCustomer);

    yield put({type: 'RENDER_SUCCESSFUL_STRIPE_REMOVE_CARD'});
  } catch(e) {
    yield put({type: 'FAILED_STRIPE_REMOVE_CARD'});
  }
}

//  End fetchDeleteCustomerCard -----------------------------------------}}}

export function *checkResponseForError(response, actionTypeForError){
  if(response.error !== undefined) {
    // Extract the user relevant error message
    const err = response.error.message;

    yield put({type: actionTypeForError, payload: {
      error: err,
    }});

    // Update the state with the correct customer data if necessary
    yield call(fetchVerifyCustomer);

    // Throwing this error stops the calling function from continuing.
    throw CreditCardException(actionTypeForError);
  }

  return response;
}

function CreditCardException(message){
  this.name = "CreditCardException";
  this.message = this.name + ": " + message;
  this.toString = () => {
    return this.message;
  }
  return this.toString();
}
