import {mapDispatchToProps} from '../../build/containers/CContact';

describe('Contact container', () => {
  const routeData = {name: "Andrew"}

  let retValue;
  const dispatch = (actions) => {
    retValue = actions;
  }

  const result = mapDispatchToProps(dispatch);

  it('opens purchase route', () => {
    result.openPurchaseRoute(routeData);
    expect(retValue).toEqual({
      type: 'GO_TO_ROUTE',
      payload: {
        route: "PurchaseBevegram",
        routeData: routeData,
      }
    });
  })

})

