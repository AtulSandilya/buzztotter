import * as React from "react";
import { Component } from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, View, ViewStyle } from 'react-native';

import BevButton from './BevButton';

interface Styles {
  parentContainer: ViewStyle;
  infoContainer: ViewStyle;
  infoTextContainer: ViewStyle;
  buttonContainer: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  parentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  infoContainer: {
    flex: -1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingLeft: 10,
  },
  infoTextContainer: {
    flex: -1,
    flexDirection: 'column',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
})

interface Name {
  first: string;
  last: string;
}

export interface ContactProps {
  name?: Name;
  birthday?: string;
  imagePath?: string;
  facebookId?: string;
  openPurchaseRoute?(Object): void;
  closePurchaseRoute?(): void;
}

const Contact: React.StatelessComponent<ContactProps> = ({name, birthday, imagePath, facebookId, openPurchaseRoute, closePurchaseRoute}) => {
  const fullName = name.first + " " + name.last;
  return (
    <View style={styles.parentContainer}>
      <View style={styles.infoContainer}>
        <Image
          source={{uri: imagePath}}
          style={{height: 50, width: 50}}
        />
        <View style={styles.infoTextContainer}>
          <Text style={{paddingLeft: 15, paddingBottom: 5}}>{fullName}</Text>
          <Text style={{paddingLeft: 15}}>{birthday}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <BevButton
          text={"Send Bevegram"}
          shortText="Send Bevegram"
          label="Send Bevegram Button"
          onPress={() => openPurchaseRoute({
            fullName: fullName,
            firstName: name.first,
            imageUri: imagePath,
            facebookId: facebookId,
          })}
          rightIcon={true}
        />
      </View>
    </View>
  )
}

export default Contact;
