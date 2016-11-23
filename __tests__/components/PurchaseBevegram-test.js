import 'react-native';
import React from 'react';
import PurchaseBevegram from '../../build/components/PurchaseBevegram';

import renderer from 'react-test-renderer';

import { initialPurchaseState } from '../../build/reducers/purchase';

it('renders correctly', () => {
  const tree = renderer.create(
    <PurchaseBevegram
      fullName="Testy McTest"
      firstName="Testy"
      purchase={initialPurchaseState}
      creditCards={[]}
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
