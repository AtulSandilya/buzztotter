import { put } from 'redux-saga/effects';

export interface SendBevegramData {
  recipentName: string,
  quantity: number,
  message: string,
  facebookId: string,
}
