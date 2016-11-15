import {put} from 'redux-saga/effects';

export function *handleFocus(action) {
  if(action.scene){
    yield put({type: 'UPDATE_CURRENT_ROUTE', payload: {
      currentRoute: action.scene.name,
    }});

    // Dispatch actions when a scene comes into focus. This avoids updating a
    // scene during a transition.
    switch(action.scene.name){
      case "PurchaseBeer":
        yield put({type: 'END_CREDIT_CARD_VERIFICATION_IF_NOT_ATTEMPTING'});
      case "MainUi":
        yield put({type: 'END_CREDIT_CARD_PURCHASE_IF_NOT_ATTEMPTING'});
      default:
        return;
    }
  }
}
