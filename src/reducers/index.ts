import { combineReducers } from "redux";

import { addCreditCard      } from "./addCreditCard";
import { app                } from "./app";
import { badges             } from "./badges";
import { bevegrams          } from "./bevegrams";
import { bevegramsTab       } from "./bevegramsTab";
import { contacts           } from "./contacts";
import { contactsView       } from "./contactsView";
import { historyView        } from "./historyView";
import { locations          } from "./locations";
import { login              } from "./login";
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

export default combineReducers({
  addCreditCard,
  app,
  badges,
  bevegrams,
  bevegramsTab,
  contacts,
  contactsView,
  historyView,
  locations,
  login,
  modals,
  purchase,
  purchasedBevegrams,
  receivedBevegrams,
  redeemedBevegrams,
  redeemView,
  routes,
  sentBevegrams,
  settings,
  user,
  view,
});
