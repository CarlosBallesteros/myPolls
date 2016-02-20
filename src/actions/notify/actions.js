import { getId } from '../../utils';
import { NotifyLevels } from './constants';

export function addNotification(text, level = NotifyLevels.INFO) {
  return (dispatch, getState) => {
    const { firebase, auth } = getState();
    const date = (new Date).toLocaleString();
    const newNotification = {
      id: getId(),
      text: text,
      level: level,
      created: date,
      pending: true,
      isNew: true
    };
    firebase.child(`notifications/${auth.id}`).once('value', snapshot => {
      const notificationsArray = snapshot.val() || [];
      const newNotificationsArray = [newNotification, ...notificationsArray];
      firebase.child(`notifications/${auth.id}`).set(newNotificationsArray);
    });
  };
}

export function setNotificationAsReaded(index) {
  return (dispatch, getState) => {
    const { firebase, auth } = getState();
    firebase.child(`notifications/${auth.id}`).once('value', snapshot => {
      const notificationsArray = snapshot.val() || [];
      const newNotificationsArray = notificationsArray.map( (message, i) => {
        return i !== index ? message : Object.assign({}, message, message.pending ? {pending: false} : {isNew: false});
      });
      firebase.child(`notifications/${auth.id}`).set(newNotificationsArray);
    });
  };
}

export function removeNotification(index) {
  return (dispatch, getState) => {
    const { firebase, auth } = getState();
    firebase.child(`notifications/${auth.id}`).once('value', snapshot => {
      const notificationsArray = snapshot.val() || [];
      const newNotificationsArray = notificationsArray.filter( (message, i) => i !== index );
      firebase.child(`notifications/${auth.id}`).set(newNotificationsArray);
    });
  };
}

export function removeAllNotifications() {
  return (dispatch, getState) => {
    const { firebase, auth } = getState();
    firebase.child(`notifications/${auth.id}`).remove();
  };
}
