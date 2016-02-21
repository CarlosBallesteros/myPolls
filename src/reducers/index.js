import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';
import polls from './poll';
import pollDetails from './pollDetails';
import pollSearch from './pollSearch';
import messages from './notify';
import actionsPending from './confirm';
import menu from './menu';
import firebase from './firebase';
import auth from './auth';
import users from './users';
import alert from './alerts';

const pollApp = combineReducers({
  alert,
  auth,
  polls,
  pollDetails,
  pollSearch,
  router,
  messages,
  actionsPending,
  menu,
  firebase,
  users
});

export default pollApp;
