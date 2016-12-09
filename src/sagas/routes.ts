import { put, select } from 'redux-saga/effects';
import {
  Keyboard,
  ToastAndroid,
} from 'react-native';

import { Actions, ActionConst } from 'react-native-router-flux';

import {isAndroid, isIOS} from '../Utilities';

import { IsPurchaseAndOrSendCompleted } from '../components/PurchaseAndOrSendInProgress';

export function *goToRoute(action){

  const nextRoute = action.payload.route;
  let nextRouteData = {};
  if(action.payload.routeData){
    nextRouteData = action.payload.routeData;
  }

  yield put({type: 'ADD_ROUTE', payload: {
      route: nextRoute,
      data: nextRouteData,
  }});

  Actions[nextRoute]();
}

interface GoBackRoutePayloadProps {
  route: string;
  nextRoute: string;
  preActions?: [{any}];
  postActions?: [{any}];
}

export function *goBackRoute(action) {
  const nextRoute = yield select((state) => state.routes.previousRoute);
  const currentRoute = yield select((state) => state.routes.currentRoute);

  const routesThatDontGoBack = {
    "MainUi": true,
    "Login": true,
  }

  if(routesThatDontGoBack[currentRoute] === undefined){
    Keyboard.dismiss();

    // Android: Disable the back button while a purchase and/or send
    // is in progress
    if(currentRoute === "PurchaseInProgress" || currentRoute === "SendInProgress"){
      const purchaseState = yield select((state) => state.purchase);
      const routeState = yield select((state) => {
        return Object.assign({},
         state.routes.PurchaseInProgress.data,
         state.routes.SendInProgress.data,
        );
      });

      const allowGoBack = IsPurchaseAndOrSendCompleted(
        routeState.userIsPurchasing,
        routeState.userIsSending,
        purchaseState.confirmed,
        purchaseState.completedSend,
      );

      if(!allowGoBack){
        if(isAndroid){

          ToastAndroid.showWithGravity(
            `Please wait until ${routeState.userIsPurchasing ? "purchasing" : "sending"} is complete.`,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        }
        return;
      } else {
        Actions["MainUi"]({type: ActionConst.BACK, popNum: 2});
      }
    } else {
      Actions[nextRoute]({type: ActionConst.BACK});
    }


    yield put({type: 'CLOSE_ROUTE', payload: {
        route: currentRoute,
    }});
  // Inside the `MainUi` route the back button should go back a tab
  } else if (currentRoute === "MainUi"){
    yield put({type: 'GOBACK_VIEW'});
  }
}

export function *onFocusRoute(action) {
  if(action.scene){
    yield put({type: 'UPDATE_CURRENT_ROUTE', payload: {
      currentRoute: action.scene.name,
    }});

    // Dispatch actions when a scene comes into focus. This avoids updating a
    // scene during a transition.
    switch(action.scene.name){
      case "PurchaseBevegram":
        yield put({type: 'END_CREDIT_CARD_VERIFICATION_IF_NOT_ATTEMPTING'});
      case "MainUi":
        yield put({type: 'END_CREDIT_CARD_PURCHASE_IF_NOT_ATTEMPTING'});
      default:
        return;
    }
  }
}

