import { combineReducers } from 'redux';

import { settings } from './settings';
import { view } from './view';
import { contacts } from './contacts'

export default combineReducers({
  settings,
  view,
  contacts,
})
