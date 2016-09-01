import { combineReducers } from 'redux';

import { settings } from './settings';
import { view } from './view';

export default combineReducers({
  settings,
  view,
})
