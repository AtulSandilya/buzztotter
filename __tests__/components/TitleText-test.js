import 'react-native';
import React from 'react';
import TitleText from '../../build/components/TitleText';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <TitleText
      title="Title:"
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
