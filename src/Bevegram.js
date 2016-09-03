import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import BevButton from './BevButton'
import CenteredModal from './CenteredModal'
import RedeemBeer from './RedeemBeer'

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
    flex: 2,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
})

export default class Bevegram extends Component {
  constructor(props){
    super(props);
    this.state = {
      buyBeerVisible: false,
    }
  }

  static propTypes = {
    from: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired,
    date: React.PropTypes.string.isRequired,
    imagePath: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
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
            <Text style={{paddingLeft: 15, paddingBottom: 5}}>From: {this.props.from}</Text>
            <Text style={{paddingLeft: 15}}>{this.props.date}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <BevButton
            buttonText={"Redeem this Beer!"}
            bevButtonPressed={this.buttonPressed.bind(this)}
          />
        </View>
        <CenteredModal
          isVisible={this.state.buyBeerVisible}
          closeFromParent={this.closeModal.bind(this)}
        >
          <View style={{flex: 1}}>
            <RedeemBeer
              name={this.props.from}
              cancelPurchaseAction={this.closeModal.bind(this)}
              id={this.props.id}
            />
          </View>
        </CenteredModal>
      </View>
    );
  }
}
