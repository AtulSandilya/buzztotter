import { combineReducers } from 'redux';

import { settings }  from './settings';
import { view }      from './view';
import { contacts }  from './contacts';
import { bevegrams } from './bevegrams';
import { modals }    from './modals';

export default combineReducers({
  settings,
  view,
  contacts,
  bevegrams,
  modals,
})
