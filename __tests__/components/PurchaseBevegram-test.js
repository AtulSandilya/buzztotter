import 'react-native';
import React from 'react';
import PurchaseBevegram from '../../build/components/PurchaseBevegram';

import renderer from 'react-test-renderer';

import { initialPurchaseState } from '../../build/reducers/purchase';

it('renders correctly', () => {
  const purchasePackages = [{
      name: "One",
      quantity: 1,
      price: 7.50,
  }]
  const tree = renderer.create(
    <PurchaseBevegram
      fullName="Testy McTest"
      firstName="Testy"
      purchase={initialPurchaseState}
      creditCards={[]}
      selectedPurchasePackage={purchasePackages[0]}
      purchasePackages={purchasePackages}
      imageUri="test.jpg"
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
