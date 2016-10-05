import * as React from "react";
import { Component, PropTypes } from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { connect } from 'react-redux';
import { modalKeys } from '../reducers/modals.js';

import BevButton from './BevButton';

interface Style {
  parentContainer: React.ViewStyle;
  infoContainer: React.ViewStyle;
  infoTextContainer: React.ViewStyle;
  buttonContainer: React.ViewStyle;
}

const styles = StyleSheet.create<Style>({
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

interface DataForModal {
  id: string;
  from: string;
}

export interface BevegramProps {
  from: string;
  date: string;
  id: string;
  imagePath: string;
  openModal?(inputKey: string, modalData: DataForModal): void;
}

const Bevegram: React.StatelessComponent<BevegramProps> = ({from, date, id, openModal, imagePath}) => (
  <View style={styles.parentContainer}>
    <View style={styles.infoContainer}>
      <Image
        source={require('../../img/icons/bev-contact.png')}
      />
      <View style={styles.infoTextContainer}>
        <Text style={{paddingLeft: 15, paddingBottom: 5}}>From: {from}</Text>
        <Text style={{paddingLeft: 15}}>{date}</Text>
      </View>
    </View>
    <View style={styles.buttonContainer}>
      <BevButton
        buttonText={"Redeem this Beer!"}
        bevButtonPressed={() => openModal(modalKeys.redeemBevegramModal, {id: id, from: from})}
      />
    </View>
  </View>
)

export default Bevegram;
