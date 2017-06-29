import { combineReducers } from "redux";

import { reducer as network } from "react-native-offline";

import { addCreditCard      } from "./addCreditCard";
import { app                } from "./app";
import { badges             } from "./badges";
import { banners            } from "./banners";
import { bevegrams          } from "./bevegrams";
import { bevegramsTab       } from "./bevegramsTab";
import { contacts           } from "./contacts";
import { contactsView       } from "./contactsView";
import { historyView        } from "./historyView";
import { locations          } from "./locations";
import { locationsView      } from "./locationsView";
import { login              } from "./login";
import { message            } from "./message";
import { modals             } from "./modals";
import { purchase           } from "./purchase";
import { purchasedBevegrams } from "./purchasedBevegrams";
import { receivedBevegrams  } from "./receivedBevegrams";
import { redeemedBevegrams  } from "./redeemedBevegrams";
import { redeemView         } from "./redeemView";
import { routes             } from "./routes";
import { sentBevegrams      } from "./sentBevegrams";
import { settings           } from "./settings";
import { user               } from "./user";
import { view               } from "./view";

const appReducer = combineReducers({
  addCreditCard,
  app,
  badges,
  banners,
  bevegrams,
  bevegramsTab,
  contacts,
  contactsView,
  historyView,
  locations,
  locationsView,
  login,
  message,
  modals,
  network,
  purchase,
  purchasedBevegrams,
  receivedBevegrams,
  redeemView,
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
