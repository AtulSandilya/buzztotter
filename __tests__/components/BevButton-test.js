import 'react-native';
import React from 'react';
import BevButton from '../../build/components/BevButton';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <BevButton
      text="Test"
      shortText="Test"
      bevButtonPressed={() => {}}
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders correctly with button size', () => {
  const tree = renderer.create(
    <BevButton
      buttonFontSize={18}
      text="Test"
      shortText="Test"
      bevButtonPressed={() => {}}
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
