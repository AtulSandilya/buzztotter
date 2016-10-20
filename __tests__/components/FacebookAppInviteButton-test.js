import 'react-native';
import React from 'react';
import FacebookAppInviteButton from '../../build/components/FacebookAppInviteButton';

import renderer from 'react-test-renderer';

describe('Facebook App Invite Button', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <FacebookAppInviteButton />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
