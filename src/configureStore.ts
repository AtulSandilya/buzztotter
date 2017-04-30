import { applyMiddleware, combineReducers, createStore } from "redux";

import createSagaMiddleware from "redux-saga";

import * as persistentStorage from "redux-storage";
import filter from "redux-storage-decorator-filter";
import createEngine from "redux-storage-engine-reactnativeasyncstorage";

import appReducers from "./reducers";
import rootSaga from "./sagas/index";

let engine = createEngine("BevStorage");
engine = filter(engine,
  [
    // Explicitly save these state keys
  ],
  [
    // Don't save these state keys
    "purchase",
    "addCreditCard",
    "view",
    "modals",
    "bevegramsTab",
    ["contacts", "loadingFromFacebook"],
    ["contacts", "loadingFromFacebookFailed"],
    ["contacts", "reloadingFromFacebookFailed"],
    ["contacts", "reloadingFromFacebookFailed"],
  ],
);
const storageMiddleware = persistentStorage.createMiddleware(engine);
const storageReducer = persistentStorage.reducer(appReducers);

const sagaMiddleware = createSagaMiddleware();

function configureStore(reducers) {
  const store = createStore(reducers, applyMiddleware(
    sagaMiddleware,
    storageMiddleware,
  ));
  sagaMiddleware.run(rootSaga);

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require("./reducers/index").default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

const store = configureStore(storageReducer);

const load = persistentStorage.createLoader(engine);
load(store)
  .then((newState) => {
    store.dispatch({type: "LOADING_COMPLETE"});
  });

export default store;
