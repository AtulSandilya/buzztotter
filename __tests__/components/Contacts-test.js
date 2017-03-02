import React from 'react';
import { ListView, Text, View } from 'react-native';

import { shallow } from 'enzyme';

import Contacts from '../../build/components/Contacts';

describe('Contacts component', () => {

  it('renders with Contacts', () => {
    const wrapper = shallow(
      <Contacts
        contacts={[
          {
            name: { first: "Person", last: "McPerson" },
            birthday: "12/12",
            birthDayOfYear: 200,
            imagePath: "test.jpg",
          }
        ]}
        loading={false}
        reloading={false}
      />
    )

    const list = wrapper.find(ListView);
    expect(list).toBeDefined();
  })
})

