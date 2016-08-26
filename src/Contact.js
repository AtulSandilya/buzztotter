import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import BevButton from './BevButton'
import CenteredModal from './CenteredModal'

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  infoContainer: {
    flex: 2,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  infoTextContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
})

export default class Contact extends Component {
  constructor(props){
    super(props);
    this.state = {
      buyBeerVisible: false,
    }
  }

  static propTypes = {
    name: React.PropTypes.string,
    birthday: React.PropTypes.string,
    imagePath: React.PropTypes.string,
  }

  buttonPressed(){
    // Show BuyBeer Modal
    this.setState({
      buyBeerVisible: true,
    });
  }

  closeModal(){
    this.setState({
      buyBeerVisible: false,
    });
  }

  render() {
    return(
      <View style={styles.parentContainer}>
        <View style={styles.infoContainer}>
          <Image
            source={require('../img/icons/bev-contact.png')}
          />
          <View style={styles.infoTextContainer}>
            <Text style={{paddingLeft: 15, paddingBottom: 5}}>{this.props.name}</Text>
            <Text style={{paddingLeft: 15}}>{this.props.birthday}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <BevButton
            buttonText={"Send " + this.props.name + " a Beer!"}
            bevButtonPressed={this.buttonPressed.bind(this)}
          />
        </View>
        <CenteredModal
          isVisible={this.state.buyBeerVisible}
          closeFromParent={this.closeModal.bind(this)}
        >
          <TouchableHighlight
            onPress={this.closeModal.bind(this)}
          >
            <Text style={{padding: 50}}>Send a beer to {this.props.name}</Text>
          </TouchableHighlight>
        </CenteredModal>
      </View>
    );
  }
}
