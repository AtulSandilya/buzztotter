import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { modalKeys } from './reducers/modals.js';

import BevButton from './components/BevButton'
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

class Bevegram extends Component {
  static propTypes = {
    from: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired,
    date: React.PropTypes.string.isRequired,
    imagePath: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
  }

  openModal(){
    this.props.onModalOpen(modalKeys.redeemBevegramModal, {
      id: this.props.id,
      name: this.props.from,
    });
  }

  closeModal(){
    this.props.onModalClose(modalKeys.redeemBevegramModal);
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
            bevButtonPressed={this.openModal.bind(this)}
          />
        </View>
        <CenteredModal
          isVisible={this.props.modalIsOpen}
          closeFromParent={this.closeModal.bind(this)}
        >
          <View style={{flex: 1}}>
            <RedeemBeer
              cancelPurchaseAction={this.closeModal.bind(this)}
            />
          </View>
        </CenteredModal>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    modalIsOpen: state.modals.redeemBevegramModal.isOpen,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onModalOpen: (inputKey, modalData) => {
      dispatch({type: 'OPEN_MODAL', modalKey: inputKey, dataForModal: modalData});
    },
    onModalClose: (inputKey) => {
      dispatch({type: 'CLOSE_MODAL', modalKey: inputKey});
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bevegram);
