function setOwner(state, owner) {
  return owner;
}

export default function ownerReducer(state = '', action) {
  switch (action.type) {
    case 'SET_OWNER':
      return setOwner(state, action.owner);
    default:
      return state;
    }
}
