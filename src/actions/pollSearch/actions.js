import { SET_POLL_SEARCH, RESET_POLL_SEARCH } from './action-types';
import { MIN_SEARCH_STRING_LENGTH } from './constants';

export function pollSearch(startAt) {
  return (dispatch, getState) => {
    if (startAt.length < MIN_SEARCH_STRING_LENGTH) {
      return dispatch({
        type: RESET_POLL_SEARCH
      });
    }
    const { firebase, auth } = getState();
    const userId = auth.id;
    const ref = firebase.child('polls');
    ref.orderByChild('title').startAt(startAt).endAt(`${startAt}\uf8ff`).once('value', snapshot => {
      firebase.child(`myPolls/${userId}`).once('value', snapshot2 => {
        const myPolls = Object.keys(snapshot2.val() || {});
        dispatch({
          type: SET_POLL_SEARCH,
          polls: Object.keys(snapshot.val() || []).map( id => {
            const title = snapshot.val()[id].title;
            const isClosed = myPolls.indexOf(id) !== -1 ? false : snapshot.val()[id].isClosed || false;
            const isHidden = myPolls.indexOf(id) !== -1 ? false : snapshot.val()[id].isHidden || false;
            return ({id, title, isClosed, isHidden });
          })
        });
      });
    });
  };
}

export function resetPollSearch() {
  return dispatch => {
    return dispatch({
      type: RESET_POLL_SEARCH
    });
  };
}
