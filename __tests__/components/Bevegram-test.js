import 'react-native';
import React from 'react';
import Bevegram from '../../build/components/Bevegram';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <Bevegram
      from="Person"
      to="Person"
      date="2016-01-16T20:39:47.966Z"
      imagePath="test.jpg"
      openModal={undefined}
      message="test"
      quantity="1"
      displayAsUnseen={false}
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
