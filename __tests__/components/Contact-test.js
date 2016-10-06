import 'react-native';
import React from 'react';
import Contact from '../../build/components/Contact';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <Contact
      name={{first: "Andrew", last: "Simms"}}
      birthday="12/12"
      imagePath="test.jpg"
      openPurchaseModal={() => {}}
      closePurchaseModal={() => {}}
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// it('fails', () => {
//   const tree = renderer.create(
//     <Contact
//     />
//   ).toJSON();
//   expect(tree).toThrowErrorMatchingSnapshot();
// });
