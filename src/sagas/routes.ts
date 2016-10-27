import { put } from 'redux-saga/effects';

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

  const payload: GoBackRoutePayloadProps = action.payload;

  if(payload.preActions){
    for(let index in payload.preActions){
      yield put(payload.preActions[index]);
    }
  }

  const nextRoute = payload.nextRoute;

  Actions[nextRoute]({type: ActionConst.BACK});

  yield put({type: 'CLOSE_ROUTE', payload: {
      route: payload.route,
  }});

  if(payload.postActions){
    for(let index in payload.postActions){
      yield put(payload.postActions[index]);
    }
  }
}

