import { Image, Text, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

export default class Contact extends Component {
  static propTypes = {
    name: React.PropTypes.string,
    birthday: React.PropTypes.string,
    imagePath: React.PropTypes.string,
  }

  render() {
    return(
      <View style={{flex: 1}}>
        <Image
          source={require('../img/icons/bev-contact.png')}
        />
        <Text>{this.props.name}</Text>
        <Text>{this.props.birthday}</Text>
        <Text>Buy Beer</Text>
      </View>
    );
  }
}
