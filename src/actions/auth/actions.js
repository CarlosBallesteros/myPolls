import { pushState } from 'redux-router';
import { INIT_AUTH, SIGN_IN_SUCCESS, SIGN_OUT_SUCCESS } from './action-types.js';
import { ALERT } from '../alerts/action_types';

function generateToken(user) {
  const FirebaseTokenGenerator = require("firebase-token-generator");
  const secret = 'sRhN4rw1LfRCN8BXS5zCNpo3odJAWhTvLXXT8edk';
  const tokenGenerator = new FirebaseTokenGenerator(secret);
  return tokenGenerator.createToken({ uid: user, provider: "custom" }, { expires: 9999999999999 });
}

export function authenticate(user) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const token = generateToken(user);

    dispatch(pushState(null, '/'));

    firebase.authWithCustomToken(token, (error, authData) => {
      if (error) {
        console.error('ERROR @ authWithCustomToken :', error); // eslint-disable-line no-console
      }
      else {
        dispatch({
          type: SIGN_IN_SUCCESS,
          payload: authData,
          meta: {
            timestamp: Date.now()
          }
        });
      }
    });
  };
}

export function createUser(username, password) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.child(`users/${username}`).once('value', snapshot => {
      const userAlreadyExists = snapshot.exists();
      if (!userAlreadyExists) {
        firebase.child(`users/${username}`).set(password);
        dispatch({
          type: ALERT,
          alert: 'User created'
        });
      } else {
        dispatch({
          type: ALERT,
          alert: 'Username already exists'
        });
      }
    });
  };
}

export function authenticateWithPassword(username, password) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.child(`users/${username}`).once('value', snapshot => {
      if (snapshot.exists() && snapshot.val() === password) {
        const token = generateToken(username);

        dispatch(pushState(null, '/'));

        firebase.authWithCustomToken(token, (error, authData) => {
          if (error) {
            dispatch({
              type: ALERT,
              alert: 'Wrong!'
            });
          }
          else {
            dispatch({
              type: SIGN_IN_SUCCESS,
              payload: authData,
              meta: {
                timestamp: Date.now()
              }
            });
          }
        });
      } else if (!snapshot.exists()) {
        dispatch({
          type: ALERT,
          alert: "That user doesn't exist"
        });
      } else {
        dispatch({
          type: ALERT,
          alert: 'Wrong!'
        });
      }
    });
  };
}

export function initAuth() {
  return (dispatch, getState) => {
    const { firebase } = getState();
    dispatch({
      type: INIT_AUTH,
      payload: firebase.getAuth(),
      meta: {
        timestamp: Date.now()
      }
    });
  };
}

export function signOut() {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.unauth();
    dispatch(pushState(null, '/'));
    dispatch({
      type: SIGN_OUT_SUCCESS
    });
  };
}


export function cancelSignIn() {
  return dispatch => {
    return dispatch(pushState(null, '/'));
  };
}
