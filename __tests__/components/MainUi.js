import React from 'react';
import { View } from 'react-native';

import { shallow } from 'enzyme';

import MainUi from '../../build/components/MainUi';

describe('MainUi component', () => {
  it('renders successfully', () => {
    const wrapper = shallow(
      <MainUi />
    )

    expect(wrapper.find(View)).toBeDefined();
  })

})
