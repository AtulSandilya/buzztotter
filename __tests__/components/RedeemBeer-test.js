import React from 'react';
import { Text, View } from 'react-native';

import { shallow } from 'enzyme';

import { defaultLocationsState } from '../../build/reducers/locations';

import RedeemBeer from '../../build/components/RedeemBeer';

describe('RedeemBeer component', () => {
  it('renders successfully', () => {
    const wrapper = shallow(
      <RedeemBeer
        id="1234"
        name="Testy"
        locations={defaultLocationsState}
        receivedBevegram={{
          sentFromName: "Test McTester",
          sentFromFacebookId: "1234",
          sentFromPhotoUrl: "test.com",
          receivedDate: Date.now(),
          isRedeemed: false,
          quantity: 1,
          quantityRedeemed: 0,
        }}
        redeemTransactionStatus={{
          connectionEstablished: "complete",
          updatingDatabase: "inProgress",
        }}
      />
    )

    const numButtons = wrapper.find(View).find('BevButton').length;
    // Redeem Beer should have 2 buttons
    expect(numButtons).toEqual(2);
  })
})

