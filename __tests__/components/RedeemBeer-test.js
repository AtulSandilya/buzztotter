import React from 'react';
import { Text, View } from 'react-native';

import { shallow } from 'enzyme';

import { defaultLocationsState } from '../../build/reducers/locations';

import RedeemBeer from '../../build/components/RedeemBeer';

describe('RedeemBeer component', () => {
  it('renders successfully', () => {
    const wrapper = shallow(
      <RedeemBeer
        id="1234"
        name="Testy"
        redeemConfirmed={false}
        locations={defaultLocationsState}
      />
    )

    const titleText = wrapper.find(View).find('TitleText').props("children").title;

    expect(titleText).toEqual("Redeem Beer");
  })
})

