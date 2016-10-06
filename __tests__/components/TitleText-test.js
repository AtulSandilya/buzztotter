import 'react-native';
import React from 'react';
import TitleText from '../../src/components/TitleText';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <TitleText
      title="Title:"
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
