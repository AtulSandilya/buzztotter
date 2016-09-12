import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import BevButton from './components/BevButton';
import CenteredModal from './components/CenteredModal';
import PurchaseBeer from './PurchaseBeer';

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
    name: React.PropTypes.object,
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

  getFullName() {
    return this.props.name.first + " " + this.props.name.last;
  }

  render() {
    return(
      <View style={styles.parentContainer}>
        <View style={styles.infoContainer}>
          <Image
            source={require('../img/icons/bev-contact.png')}
          />
          <View style={styles.infoTextContainer}>
            <Text style={{paddingLeft: 15, paddingBottom: 5}}>{this.getFullName()}</Text>
            <Text style={{paddingLeft: 15}}>{this.props.birthday}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <BevButton
            buttonText={"Send " + this.props.name.first + " a Beer!"}
            bevButtonPressed={this.buttonPressed.bind(this)}
          />
        </View>
        <CenteredModal
          isVisible={this.state.buyBeerVisible}
          closeFromParent={this.closeModal.bind(this)}
        >
          <View style={{flex: 1}}>
            <PurchaseBeer
              name={this.getFullName()}
              cancelPurchaseAction={this.closeModal.bind(this)}
            />
          </View>
        </CenteredModal>
      </View>
    );
  }
}
