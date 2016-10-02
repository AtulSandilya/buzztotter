import { createStore, applyMiddleware, combineReducers } from 'redux';

import createSagaMiddleware from 'redux-saga';

import {enableBatching} from 'redux-batched-actions';

import * as persistentStorage from 'redux-storage';
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';

import appReducers from './reducers';
import rootSaga from './sagas/index';

const engine = createEngine('BevStorage');
const storageMiddleware = persistentStorage.createMiddleware(engine);
const storageReducer = persistentStorage.reducer(appReducers);

const sagaMiddleware = createSagaMiddleware();

function configureStore(reducers){
  let store = createStore(enableBatching(reducers), applyMiddleware(
    sagaMiddleware,
    storageMiddleware,
  ));
  sagaMiddleware.run(rootSaga);

  if(module.hot){
    module.hot.accept(() => {
      const nextRootReducer = require('./reducers/index').default;
      store.replaceReducer(nextRootReducer);
    })
  }

  return store;
}

let store = configureStore(storageReducer);

const load = persistentStorage.createLoader(engine);
load(store)
  .then((newState) => {
    store.dispatch({type: 'LOADING_COMPLETE'})
  });

export default store;
