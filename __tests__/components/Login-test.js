import 'react-native';
import React from 'react';
import Login from '../../build/components/Login';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <Login
     isLoggedIn={false}
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
