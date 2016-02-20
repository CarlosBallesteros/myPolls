import { SET_POLLS } from './action-types';
import { addNotification } from '../notify/actions';

export function registerListeners() {
  return (dispatch, getState) => {
    const { firebase, auth } = getState();
    const userId = auth.id;
    const ref = firebase.child(`myPolls/${userId}`);

    ref.on('value', snapshot => {
      const promises = Object.keys(snapshot.val() || []).map( pollId => new Promise(
        resolve => firebase.child(`polls/${pollId}`).once('value', snapshot => {
          const isHidden = snapshot.val().isHidden || false;
          const isClosed = snapshot.val().isClosed || false;
          return resolve({ id: pollId, title: snapshot.val().title, isHidden, isClosed } );
        })
      ));
      Promise.all(promises).then(function(polls) {
        dispatch({
          type: SET_POLLS,
          polls
        });
      });
    });

    ref.orderByChild('createdAt').startAt(Date.now()).on('child_added', child => {
      const pollName = child.val().title;
      dispatch(addNotification(`Added a new poll: "${pollName}"`));
    });

    ref.on('child_removed', child => {
      const pollName = child.val().title;
      dispatch(addNotification(`Poll removed: "${pollName}"`));
    });
  };
}

export function unregisterListeners() {
  return (dispatch, getState) => {
    const { firebase, auth } = getState();
    const userId = auth.id;
    const ref = firebase.child(`myPolls/${userId}`);
    ref.off();
    dispatch({
      type: SET_POLLS,
      polls: []
    });
  };
}
