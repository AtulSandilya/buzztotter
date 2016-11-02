import * as React from "react";
import { Component, PropTypes } from 'react';
import { Text, View } from 'react-native';

import RouteWithNavBarWrapper from './RouteWithNavBarWrapper';

export default class AddCreditCard extends Component<{}, {}> {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <RouteWithNavBarWrapper>
        <View>
          <Text>Add Credit Card!</Text>
        </View>
      </RouteWithNavBarWrapper>
    )
  }
}
