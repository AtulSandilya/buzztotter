import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import React, { Component, PropTypes } from 'react';

import BevButton from './BevButton';

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

const Contact = ({name, birthday, openPurchaseModal, closePurchaseModal}) => {
  const fullName = name.first + " " + name.last;
  return (
    <View style={styles.parentContainer}>
      <View style={styles.infoContainer}>
        <Image
          source={require('../../img/icons/bev-contact.png')}
        />
        <View style={styles.infoTextContainer}>
          <Text style={{paddingLeft: 15, paddingBottom: 5}}>{fullName}</Text>
          <Text style={{paddingLeft: 15}}>{birthday}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <BevButton
          buttonText={"Send " + name.first + " a Beer!"}
          bevButtonPressed={() => openPurchaseModal({fullName: fullName, firstName: name.first})}
        />
      </View>
    </View>
  )
}

export default Contact;
