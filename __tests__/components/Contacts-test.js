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
      />
    )

    const list = wrapper.find(ListView);
    expect(list).toBeDefined();
  })

  it('renders Loading view when loading', () => {
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
        loading={true}
        loadingFailed={false}
      />
    )

    const text = wrapper.find(View).find(Text).prop("children");
    expect(text).toBe("Loading Contacts");
  })

  it('renders Failed loading view when loading failed', () => {
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
        loadingFailed={true}
      />
    )

    const text = wrapper.find(View).find(Text).prop("children");
    expect(text).toBe("Error loading Contacts, please log out and log in again.");
  })
})

