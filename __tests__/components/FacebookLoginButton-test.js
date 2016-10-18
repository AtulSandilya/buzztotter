import 'react-native';
import React from 'react';
import FacebookLoginButton from '../../build/components/FacebookLoginButton';

import renderer from 'react-test-renderer';

describe('Facebook Login Button', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <FacebookLoginButton />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
})
