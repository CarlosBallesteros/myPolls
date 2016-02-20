import { SET_POLL, RESET_POLL } from './action-types';
import { pushState } from 'redux-router';
import { addNotification } from '../notify/actions';

export function registerListeners(params) {
  return (dispatch, getState) => {
    const { firebase, auth } = getState();
    const ref = firebase.child(`polls/${params.idPoll}`);
    ref.on('value', snapshot => {
      firebase.child(`myPolls/${auth.id}`).once('value', snapshot2 => {
        const myPolls = Object.keys(snapshot2.val() || {});
        const newPoll = snapshot.val();
        const isClosed = myPolls.indexOf(params.idPoll) !== -1 ? false : snapshot.val().isClosed || false;
        const isHidden = myPolls.indexOf(params.idPoll) !== -1 ? false : snapshot.val().isHidden || false;
        dispatch(snapshot.exists() ?
          {
            type: SET_POLL,
            poll: Object.assign({}, { id: params.idPoll, isHidden, isClosed }, newPoll)
          } :
          pushState(null, '/')
        );
      });
    });

    ref.child('entries').orderByChild('createdAt').startAt(Date.now()).on('child_added', snapshot => {
      ref.once('value', snapshot2 => {
        const pollName = snapshot2.val().title;
        const newEntry = snapshot.val();
        dispatch(addNotification(`Added new entry: "${newEntry.title}", to the poll "${pollName}"`));
      });
    });

    ref.child('entries').on('child_removed', snapshot => {
      ref.once('value', snapshot2 => {
        const pollName = snapshot2.val().title;
        const entry = snapshot.val();
        dispatch(addNotification(`Entry removed: "${entry.title}", from the poll "${pollName}"`));
      });
    });

    firebase.child(`myPolls/${auth.id}`).on('child_removed', child => {
      const pollName = child.val().title;
      dispatch(addNotification(`Poll removed: "${pollName}"`));
    });

  };
}

export function unregisterListeners(params) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.child(`polls/${params.idPoll}`).off();
    firebase.child(`polls/${params.idPoll}/entries`).off();
    dispatch({
      type: RESET_POLL
    });
  };
}
