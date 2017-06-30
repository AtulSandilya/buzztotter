import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Login from '../../build/components/Login';

it('renders correctly', () => {
  const tree = renderer.create(
    <Login
     loginInProgress={false}
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();

  it('fails without props', () => {
    expect(() => {
      renderer.create(
        <Login/>
      ).toJSON();
    }).toThrow();
  });

});
