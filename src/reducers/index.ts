import { combineReducers } from "redux";

import { reducer as network } from "react-native-offline";

import { addCreditCard } from "./addCreditCard";
import { app } from "./app";
import { badges } from "./badges";
import { banner } from "./banner";
import { bevegrams } from "./bevegrams";
import { bevegramsTab } from "./bevegramsTab";
import { contacts } from "./contacts";
import { contactsView } from "./contactsView";
import { historyView } from "./historyView";
import { locations } from "./locations";
import { locationsView } from "./locationsView";
import { login } from "./login";
import { loginView } from "./loginView";
import { message } from "./message";
import { modals } from "./modals";
import { purchase } from "./purchase";
import { purchasedBevegrams } from "./purchasedBevegrams";
import { receivedBevegrams } from "./receivedBevegrams";
import { redeem } from "./redeem";
import { redeemedBevegrams } from "./redeemedBevegrams";
import { redeemInProgressView } from "./redeemInProgressView";
import { redeemPickerView } from "./redeemPickerView";
import { redeemVendorIdView } from "./redeemVendorIdView";
import { routes } from "./routes";
import { sentBevegrams } from "./sentBevegrams";
import { settings } from "./settings";
import { user } from "./user";
import { view } from "./view";

const appReducer = combineReducers({
  addCreditCard,
  app,
  badges,
  banner,
  bevegrams,
  bevegramsTab,
  contacts,
  contactsView,
  historyView,
  locations,
  locationsView,
  login,
  loginView,
  message,
  modals,
  network,
  purchase,
  purchasedBevegrams,
  receivedBevegrams,
  redeem,
  redeemInProgressView,
  redeemPickerView,
  redeemVendorIdView,
  redeemedBevegrams,
  routes,
  sentBevegrams,
  settings,
  user,
  view,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_STATE") {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
