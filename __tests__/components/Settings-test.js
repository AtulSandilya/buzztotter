import React from 'react';
import { View } from 'react-native';

import { shallow } from 'enzyme';

import {Settings} from '../../build/components/Settings';

describe('Settings component', () => {
  it('renders successfully', () => {
    const wrapper = shallow(
      <Settings
        notifications={true}
        location={true}
        version="1.0"
      />
    )

    expect(wrapper).toBeDefined();
    const numViews = wrapper.find(View).length;
    expect(numViews).toBeGreaterThan(0);
  })
})

