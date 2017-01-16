import 'react-native';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils'

import Login from '../../build/components/Login';

const renderer = ReactTestUtils.createRenderer();

it('renders correctly', () => {
  const tree = renderer.render(
    <Login
     isLoggedIn={false}
    />
  )
  const result = renderer.getRenderOutput();
  const loginText = result.props.children[0].props.children[1].props.children;
  expect(loginText).toEqual("Sending Drinks Made Easy!");

});
