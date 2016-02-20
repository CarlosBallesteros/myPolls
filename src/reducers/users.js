import { SET_USERS } from '../actions/notify';

function setUsers(action, users) {
  return users;
}

export default function entryReducer(state = {}, action) {
  switch (action.type) {
    case SET_USERS:
      return setUsers(state, action.users);
    default:
      return state;
  }
}
