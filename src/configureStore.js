import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import {enableBatching} from 'redux-batched-actions';

import appReducers from './reducers';
import rootSaga from './sagas/sagas';

const sagaMiddleware = createSagaMiddleware();

function configureStore(reducers){
  let store = createStore(enableBatching(reducers), applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(rootSaga);

  if(module.hot){
    module.hot.accept(() => {
      const nextRootReducer = require('./reducers/index').default;
      store.replaceReducer(nextRootReducer);
    })
  }

  return store;
}

let store = configureStore(appReducers)
export default store;
