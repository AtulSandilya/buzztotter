import React from 'react';
import { Modal } from 'react-native';

import { shallow } from 'enzyme';

import CenteredModal from '../../build/components/CenteredModal';

jest.mock('react-native-fbsdk', () => '');

describe('CenteredModal component', () => {
  it('renders with no bevegrams', () => {
    const wrapper = shallow(
      <CenteredModal
        isVisible={true}
      />
    )

    expect(wrapper.find(Modal).length).toEqual(1);
  })
})

