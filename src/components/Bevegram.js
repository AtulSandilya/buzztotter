import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { modalKeys } from './reducers/modals.js';

import BevButton from './BevButton';
import CenteredModal from '../CenteredModal';
import RedeemBeer from '../RedeemBeer';

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

const Bevegram = ({from, message, date, imagePath, id, modalIsOpen, openModal, closeModal}) => (
  <View style={styles.parentContainer}>
    <View style={styles.infoContainer}>
      <Image
        source={require('../img/icons/bev-contact.png')}
      />
      <View style={styles.infoTextContainer}>
        <Text style={{paddingLeft: 15, paddingBottom: 5}}>From: {from}</Text>
        <Text style={{paddingLeft: 15}}>{date}</Text>
      </View>
    </View>
    <View style={styles.buttonContainer}>
      <BevButton
        buttonText={"Redeem this Beer!"}
        // bevButtonPressed={this.openModal.bind(this)}
        bevButtonPressed={openModal(modalKeys.redeemBevegramModal, {id: id, from: from})}
      />
    </View>
    <CenteredModal
      isVisible={this.props.modalIsOpen}
      // closeFromParent={this.closeModal.bind(this)}
      closeFromParent={closeModal(modalKeys.redeemBevegramModal)}
    >
      <View style={{flex: 1}}>
        <RedeemBeer
          cancelPurchaseAction={closeModal(modalKeys.redeemBevegramModal)}
        />
      </View>
    </CenteredModal>
  </View>
)

Bevegram.propTypes = {
  from: React.PropTypes.string.isRequired,
  message: React.PropTypes.string.isRequired,
  date: React.PropTypes.string.isRequired,
  imagePath: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
}
