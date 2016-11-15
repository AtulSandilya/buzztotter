import 'react-native';
import React from 'react';
import PurchaseBeer from '../../build/components/PurchaseBeer';

import renderer from 'react-test-renderer';

import { initialPurchaseState } from '../../build/reducers/purchase';

it('renders correctly', () => {
  const tree = renderer.create(
    <PurchaseBeer
      fullName="Testy McTest"
      firstName="Testy"
      purchase={initialPurchaseState}
      creditCards={[]}
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
