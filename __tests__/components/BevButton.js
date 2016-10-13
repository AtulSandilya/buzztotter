import 'react-native';
import React from 'react';
import BevButton from '../../build/components/BevButton';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <BevButton
      buttonText="Test"
      bevButtonPressed={undefined}
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('fails without buttonText', () => {
  const tree = renderer.create(
    <BevButton
      bevButtonPressed={undefined}
    />
  ).toJSON();
  expect(tree).toThrowErrorMatchingSnapshot();
});

it('fails without callback', () => {
  const tree = renderer.create(
    <BevButton
      buttonText="Test"
    />
  ).toJSON();
  expect(tree).toThrowErrorMatchingSnapshot();
});
