import * as React from "react";
import { Component, PropTypes } from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import TimeAgo from 'react-timeago';

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
    flex: -1,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
})

interface DataForRoute {
  id: string;
  from: string;
}

export interface BevegramProps {
  from: string;
  date: string;
  id: string;
  imagePath: string;
  goToRedeem?(routeData: DataForRoute): void;
}

const Bevegram: React.StatelessComponent<BevegramProps> = ({from, date, id, goToRedeem, imagePath}) => (
  <View style={styles.parentContainer}>
    <View style={styles.infoContainer}>
      <Image
        source={imagePath ?
          {uri: imagePath}
        :
          require('../../img/icons/bev-contact.png')
        }
        style={{height: 50, width: 50}}
      />
      <View style={styles.infoTextContainer}>
        <Text style={{paddingLeft: 15, paddingBottom: 5}}>From: {from}</Text>
        <TimeAgo
          style={{paddingLeft: 15}}
          date={date}
          component={Text}
        />
      </View>
    </View>
    <View style={styles.buttonContainer}>
      <BevButton
        text={"Redeem this Beer!"}
        shortText="Redeem"
        label="Redeem Beer Button"
        onPress={() => goToRedeem({id: id, from: from})}
        rightIcon={true}
      />
    </View>
  </View>
)

export default Bevegram;
