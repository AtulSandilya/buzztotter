import React from 'react';
import { Text, View } from 'react-native';

import renderer from 'react-test-renderer';

import { defaultLocationsState } from '../../build/reducers/locations';

import RedeemBeer from '../../build/components/RedeemBeer';

describe('RedeemBeer component', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
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
        pickerLocations={[undefined, undefined, undefined]}
        updateLocation={() => console.log("Redeem")}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('fails without props', () => {
    expect(() => {
      renderer.create(
        <RedeemBeer/>
      ).toJSON();
    }).toThrow();
  });
})

