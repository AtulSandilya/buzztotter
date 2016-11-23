import { put, select } from 'redux-saga/effects';

import { Actions, ActionConst } from 'react-native-router-flux';

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
    Actions[nextRoute]({type: ActionConst.BACK});

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

