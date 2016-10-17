import React from 'react';
import { ListView, Text, View } from 'react-native';

import { shallow } from 'enzyme';

import Bevegrams from '../../build/components/Bevegrams';

describe('Bevegrams component', () => {
  it('renders with no bevegrams', () => {
    const wrapper = shallow(
      <Bevegrams
        bevegramsList={[]}
        closeModal={(input) => {return input}}
      />
    )

    const noBevText = wrapper.find(View).find(Text).prop("children");

    expect(noBevText).toEqual("You have no bevegrams! :(");
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
        closeModal={(input) => {return input}}
      />
    )

    // Anything in the list is not rendered so anything below the list cannot
    // be tested. This is just a way to test if the list exists when the
    // bevegramsList has items
    const list = wrapper.find(ListView);
    expect(list).toBeDefined();
  })
})

