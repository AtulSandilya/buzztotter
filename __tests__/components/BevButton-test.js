import 'react-native';
import React from 'react';
import BevButton from '../../build/components/BevButton';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <BevButton
      buttonText="Test"
      bevButtonPressed={() => {}}
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders correctly with button size', () => {
  const tree = renderer.create(
    <BevButton
      buttonFontSize={18}
      buttonText="Test"
      bevButtonPressed={() => {}}
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('fails with no buttonText', () => {
  const tree = renderer.create(
    <BevButton
      bevButtonPressed={() => {}}
    />
  ).toJSON();
  expect(tree).toThrowErrorMatchingSnapshot();
});

it('fails with no props', () => {
  const tree = renderer.create(
    <BevButton/>
  ).toJSON();
  expect(tree).toThrowErrorMatchingSnapshot();
});
