export const modalKeys = {
  purchaseBeerModal: "purchaseBeerModal",
  redeemBevegramModal: "redeemBevegramModal",
  settingsModal: "settingsModal",
};

const defaultModalState = {
  purchaseBeerModal: {
    confirmed: false,
    data: {},
    isOpen: false,
  },
  redeemBevegramModal: {
    confirmed: false,
    data: {},
    isOpen: false,
  },
  settingsModal: {
    data: {},
    isOpen: false,
  },
};

export const modals = (state = defaultModalState, action) => {
  switch (action.type) {
    case "OPEN_MODAL":
      return openModal(state, action.modalKey, action.dataForModal);
    case "CLOSE_MODAL":
      return closeModal(state, action.modalKey);
    case "CONFIRM_MODAL":
      return confirmModal(state, action.modalKey);
    default:
      return state;
  }
};

const openModal = (state, key, modalData) => {
  const newState = { ...state };
  newState[key].isOpen = true;
  newState[key].data = modalData;
  return newState;
};

const closeModal = (state, key) => {
  const newState = { ...state };
  newState[key].isOpen = false;
  newState[key].data = {};
  newState[key].confirmed = false;
  return newState;
};

const confirmModal = (state, key) => {
  const newState = { ...state };
  newState[key].confirmed = true;
  return newState;
};
