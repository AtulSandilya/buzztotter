import { combineReducers } from 'redux';

import { settings           } from './settings';
import { view               } from './view';
import { contacts           } from './contacts';
import { bevegrams          } from './bevegrams';
import { modals             } from './modals';
import { login              } from './login';
import { locations          } from './locations';
import { user               } from './user';
import { purchase           } from './purchase';
import { app                } from './app';
import { routes             } from './routes';
import { addCreditCard      } from './addCreditCard';
import { purchasedBevegrams } from './purchasedBevegrams';
import { sentBevegrams      } from './sentBevegrams';
import { receivedBevegrams  } from './receivedBevegrams';
import { redeemedBevegrams  } from './redeemedBevegrams';
import { bevegramsTab       } from './bevegramsTab';

export default combineReducers({
  settings,
  view,
  contacts,
  bevegrams,
  modals,
  login,
  locations,
  user,
  purchase,
  app,
  routes,
  addCreditCard,
  purchasedBevegrams,
  sentBevegrams,
  receivedBevegrams,
  redeemedBevegrams,
  bevegramsTab,
})
