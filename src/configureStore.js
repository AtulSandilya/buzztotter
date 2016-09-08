import { createStore } from 'redux';
import {enableBatching} from 'redux-batched-actions';

import appReducers from './reducers';

function configureStore(reducers){
  let store = createStore(enableBatching(reducers));

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
