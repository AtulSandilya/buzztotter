import React, { Component} from 'react';
import {ActivityIndicator, ListView, StyleSheet, Text, View, } from 'react-native';


import {globalStyles, globalColors} from './GlobalStyles.js';
import CContact from '../containers/CContact';
import CenteredModal from './CenteredModal';
import CPurchaseBeer from '../containers/CPurchaseBeer';

const Contacts = ({contacts, loading, loadingFailed, purchaseModalIsOpen, closePurchaseModal}) => {
  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  if(loading){
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator
          color={globalColors.bevPrimary}
        />
        <Text>Loading Contacts</Text>
      </View>
    )
  } else if(loadingFailed){
    return (
      <View>
        <Text>Error loading Contacts, please log out and log in again.</Text>
      </View>
    )
  } else {
    return (
      <View style={{flex: 1}}>
        <ListView
          dataSource={ds.cloneWithRows(contacts)}
          renderRow={(rowData) =>
            <CContact
              name={rowData.name}
              birthday={rowData.birthday}
              imagePath={rowData.imagePath}
            />
          }
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={globalStyles.listRowSeparator} />}
        />
        <CenteredModal
          isVisible={purchaseModalIsOpen}
          closeFromParent={() => closePurchaseModal()}
        >
          <View style={{flex: 1}}>
            <CPurchaseBeer />
          </View>
        </CenteredModal>
      </View>
    )
  }
}

export default Contacts;
