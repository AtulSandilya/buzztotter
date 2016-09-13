export const modalKeys = {
  purchaseBeerModal: 'purchaseBeerModal',
  redeemBevegramModal: 'redeemBevegramModal',
  settingsModal: 'settingsModal',
}

const defaultModalState = {
  purchaseBeerModal: {
    isOpen: false,
    data: {},
    confirmed: false,
  },
  redeemBevegramModal: {
    isOpen: false,
    data: {},
    confirmed: false,
  },
  settingsModal: {
    isOpen: false,
    data: {},
  }
}

export const modals = (state = defaultModalState, action) => {
  switch(action.type){
    case 'OPEN_MODAL':
      return openModal(state, action.modalKey, action.dataForModal);
    case 'CLOSE_MODAL':
      return closeModal(state, action.modalKey);
    case 'CONFIRM_MODAL':
      return confirmModal(state, action.modalKey);
    default:
      return state;
  }
}

const openModal = (state, key, modalData) => {
  let newState = Object.assign({}, state);
  newState[key].isOpen = true;
  newState[key].data = modalData;
  return newState;
}

const closeModal = (state, key) => {
  let newState = Object.assign({}, state);
  newState[key].isOpen = false;
  newState[key].data = {};
  newState[key].confirmed = false;
  return newState;
}

const confirmModal = (state, key) => {
  let newState = Object.assign({}, state);
  newState[key].confirmed = true;
  return newState;
}
