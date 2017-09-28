import React from 'react';
import { ListView, Text, View } from 'react-native';

import { shallow } from 'enzyme';

import Bevegrams from '../../build/components/Bevegrams';

const messageModalData = {
  date: 1,
  from: "Test Person",
  message: "test",
  photoUrl: "test",
}

describe('Bevegrams component', () => {
  it('renders with no bevegrams', () => {
    const wrapper = shallow(
      <Bevegrams
        bevegramsList={[]}
        closeModal={(input) => {return input}}
        messageModalData={messageModalData}
        isLoadingBevegrams={false}
      />
    )

    // Test that the list view is only rendering a single page. Right now with
    // enzyme it is not possible to test the contents of a ListView?
    const listViewSize = wrapper.find(ListView).prop("pageSize");

    expect(listViewSize).toEqual(undefined);
  })

  it('renders with bevegrams', () => {
    const wrapper = shallow(
      <Bevegrams
        bevegramsList={[
          {
            name: "Testy McTest",
            message: "",
            date: "12/12",
            imagePath: "test.jpg",
            id: "test",
          }
        ]}
        messageModalData={messageModalData}
        closeModal={(input) => {return input}}
        isLoadingBevegrams={false}
      />
    )

    // Anything in the list is not rendered so anything below the list cannot
    // be tested. This is just a way to test if the list exists when the
    // bevegramsList has items
    const list = wrapper.find(ListView);
    expect(list).toBeDefined();
  })
})

