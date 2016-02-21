import { SET_NOTIFICATIONS, SET_USERS } from './action-types';
import { tokens } from '../../utils/tokens';

export function registerNotificationsListeners() {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.onAuth( authData => {
      if (authData) {
        firebase.child(`notifications/${authData.uid}`).on('value', snapshot => {
          const notificationsArray = snapshot.val() || [];
          dispatch({
            type: SET_NOTIFICATIONS,
            notifications: notificationsArray
          });
        });
      } else {
        firebase.child(`notifications`).off();
        dispatch({
          type: SET_NOTIFICATIONS,
          notifications: []
        });
      }
    });
  };
}

export function unregisterNotificationsListeners() {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.child(`notifications`).off();
    dispatch({
      type: SET_NOTIFICATIONS,
      notifications: []
    });
  };
}

export function registerUsersListener() {
  return (dispatch) => {
    const users = Object.keys(tokens);
    dispatch({
      type: SET_USERS,
      users: users
    });
  };
}

export function unregisterUsersListener() {
  return (dispatch) => {
    dispatch({
      type: SET_USERS,
      users: []
    });
  };
}
