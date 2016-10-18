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
    const titleText = wrapper.find(View).find('TitleText').props("children").title;
    expect(titleText).toEqual("Settings");
  })
})

