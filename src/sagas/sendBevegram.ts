import { put } from 'redux-saga/effects';

export interface SendBevegramData {
  recipentName: string,
  quantity: number,
  message: string,
  facebookId: string,
}

export function *sendBevegram(action){
  const sendData: SendBevegramData = action.payload.sendBevegramData;
  try{
    yield put({type: 'ATTEMPTING_SEND_BEVEGRAM'});
    yield put({type: 'SUCCESSFUL_SEND_BEVEGRAM', payload: {
      sentBevegrams: sendData.quantity,
    }})
    yield put({type: 'COMPLETED_SEND_BEVEGRAM'});
  } catch(e) {
    yield put({type: 'FAILED_SEND_BEVEGRAM'});
  }
}
