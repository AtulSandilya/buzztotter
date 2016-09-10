import { combineReducers } from 'redux';

import { settings }  from './settings';
import { view }      from './view';
import { contacts }  from './contacts';
import { bevegrams } from './bevegrams';
import { modals }    from './modals';
import { login }     from './login';
import { locations } from './locations';

export default combineReducers({
  settings,
  view,
  contacts,
  bevegrams,
  modals,
  login,
  locations,
})
