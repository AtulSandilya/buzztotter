import { applyMiddleware, createStore } from "redux";
import { enableBatching } from "redux-batched-actions";

import { createNetworkMiddleware } from "react-native-offline";
import createSagaMiddleware from "redux-saga";

import * as persistentStorage from "redux-storage";
import filter from "redux-storage-decorator-filter";
import createEngine from "redux-storage-engine-reactnativeasyncstorage";

import appReducers from "./reducers";
import rootSaga from "./sagas/index";

let engine = createEngine("BevStorage");
engine = filter(
  engine,
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
    "locationsView",
    "historyView",
    "contactsView",
    "redeemVendorIdView",
    "banner",
    "redeem",
    ["contacts", "loadingFromFacebook"],
    ["contacts", "loadingFromFacebookFailed"],
    ["contacts", "reloadingFromFacebookFailed"],
    ["contacts", "reloadingFromFacebookFailed"],
  ],
);
const storageMiddleware = persistentStorage.createMiddleware(engine);
const storageReducer = persistentStorage.reducer(appReducers);

const sagaMiddleware = createSagaMiddleware();
const networkMiddleware = createNetworkMiddleware();

function configureStore(reducers) {
  const store = createStore(
    enableBatching(reducers),
    applyMiddleware(networkMiddleware, sagaMiddleware, storageMiddleware),
  );
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
load(store).then(newState => {
  store.dispatch({ type: "LOADING_COMPLETE" });
});

export default store;
