import React, { Component, PropTypes } from 'react';
import { View, Text } from 'react-native';

export default class Bevegrams extends Component {
  render() {
    return(
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text>
          No one has bought you a drink yet :(
        </Text>
      </View>
    );
  }
}
