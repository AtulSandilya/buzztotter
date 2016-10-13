import 'react-native';
import React from 'react';
import Bevegram from '../../build/components/Bevegram';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <Bevegram
      from="Person"
      to="Person"
      date="12/12"
      imagePath="test.jpg"
      openModal={undefined}
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('fails without required props', () => {
  const tree = renderer.create(
    <Bevegram
    />
  ).toJSON();
  expect(tree).toThrowErrorMatchingSnapshot();
});
