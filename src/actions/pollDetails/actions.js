import Firebase from 'firebase';
import {
  UPDATE_POLL_ERROR
} from './action-types';

export function editPollTitle(idPoll, title) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.child(`polls/${idPoll}`)
      .update({title}, error => {
        if (error) {
          console.error('ERROR @ updatePoll :', error); // eslint-disable-line no-console
          dispatch({
            type: UPDATE_POLL_ERROR,
            payload: error,
        });
      }
    });
  };
}

export function hidePoll(idPoll) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.child(`polls/${idPoll}/isHidden`).transaction( snapshot => !snapshot, () => {}, false);
  };
}

export function closePoll(idPoll) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.child(`polls/${idPoll}/isClosed`).transaction( snapshot => !snapshot, () => {}, false);
  };
}

export function addEntry(idPoll, title) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.child(`polls/${idPoll}/entries`)
      .push({ title, votes: 0, createdAt: Firebase.ServerValue.TIMESTAMP }, error => {
        if (error) {
          console.error('ERROR @ updatePoll :', error); // eslint-disable-line no-console
          dispatch({
            type: UPDATE_POLL_ERROR,
            payload: error,
        });
      }
    });
  };
}

export function removeEntry(idPoll, idEntry) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.child(`polls/${idPoll}/entries/${idEntry}`)
      .remove(error => {
        if (error) {
          console.error('ERROR @ updatePoll :', error); // eslint-disable-line no-console
          dispatch({
            type: UPDATE_POLL_ERROR,
            payload: error,
        });
      }
    });
  };
}

export function voteEntry(idPoll, idEntry) {
  return (dispatch, getState) => {
    const { firebase, auth } = getState();
    const userId = auth.id;
    firebase.child(`polls/${idPoll}`).once('value', snapshot => {
      firebase.child(`myPolls/${userId}`).once('value', snapshot2 => {
        const myPolls = Object.keys(snapshot2.val() || {});
        const isMyPoll = myPolls.indexOf(idPoll) !== -1;
        const voted = snapshot.val().voted ? Object.values(snapshot.val().voted) : [];
        if ((voted.filter( value => value === userId ).length === 0 && userId && !snapshot.val().isClosed) || isMyPoll) {
          firebase.child(`polls/${idPoll}/entries/${idEntry}/votes`).transaction(votes => votes + 1, error => {
              if (error) {
                console.error('ERROR @ updatePoll :', error); // eslint-disable-line no-console
                dispatch({
                  type: UPDATE_POLL_ERROR,
                  payload: error,
              });
            }
          });
          firebase.child(`polls/${idPoll}/voted`).push(userId);
        }
      });
    });
  };
}
