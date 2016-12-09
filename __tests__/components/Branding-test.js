import React from 'react';
import { View } from 'react-native';

import { shallow } from 'enzyme';

import Branding from '../../build/components/Branding';

jest.mock('react-native-fbsdk', () => '');

describe('Branding component', () => {
  it('renders with no bevegrams', () => {
    const wrapper = shallow(
      <Branding
        bevegramsList={[]}
        closeModal={(input) => {return input}}
      />
    )

    // Branding container view has 5 children
    expect(wrapper.find(View).length).toEqual(5);
  })
})

