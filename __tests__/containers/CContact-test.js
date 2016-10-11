import {mapDispatchToProps} from '../../build/containers/CContact';
import {modalKeys} from '../../build/reducers/modals';

describe('Contact container', () => {
  const modalData = {name: "Andrew"}

  let retValue;
  const dispatch = (actions) => {
    retValue = actions;
  }

  const result = mapDispatchToProps(dispatch);

  it('opens purchase modal', () => {
    result.openPurchaseModal(modalData);
    expect(retValue).toEqual({
      type: 'OPEN_MODAL',
      modalKey: modalKeys.purchaseBeerModal,
      dataForModal: modalData,
    });
  })

  it('closes purchase modal', () => {
    result.closePurchaseModal();
    expect(retValue).toEqual({
      type: 'CLOSE_MODAL',
      modalKey: modalKeys.purchaseBeerModal,
    });
  })
})

