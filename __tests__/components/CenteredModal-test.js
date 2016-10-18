import React from 'react';
import { Modal } from 'react-native';
import renderer from 'react-test-renderer';

import CenteredModal from '../../build/components/CenteredModal';

jest.mock('react-native-fbsdk', () => '');

describe('CenteredModal component', () => {

  it('renders correctly', () => {
    const tree = renderer.create(
      <CenteredModal
        isVisible={true}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
})
