import { ALERT } from '../actions/alerts';

function throwAlert(state, alert) {
  return alert;
}

export default function alertReducer(state = '', action) {
  switch (action.type) {
    case ALERT:
      return throwAlert(state, action.alert);
    default:
      return state;
    }
}
