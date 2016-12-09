import * as React from "react";
import { Component} from 'react';
import {ActivityIndicator, ListView, RefreshControl, StyleSheet, Text, ToastAndroid, View, } from 'react-native';

import {globalStyles, globalColors} from './GlobalStyles.js';

import { isAndroid } from '../Utilities';

import CContact from '../containers/CContact';
import FacebookAppInviteButton from './FacebookAppInviteButton';
import CBevegramStatusBar from '../containers/CBevegramStatusBar';

import {Contact} from '../reducers/contacts';

export interface ContactsProps {
  tabLabel?: string;
  contacts?: [Contact];
  loading?: boolean;
  loadingFailed?: boolean;
  reloading?: boolean;
  reloadingFailed?: boolean;
  purchaseModalIsOpen?: boolean;
  facebookToken?: string;
  toastContactsReloaded?: boolean;
  closePurchaseModal?(): void;
  reloadContacts?(token: string);
}

const Contacts: React.StatelessComponent<ContactsProps> = ({contacts, loading, loadingFailed, reloading, reloadingFailed, facebookToken, toastContactsReloaded, purchaseModalIsOpen, closePurchaseModal, reloadContacts}) => {
  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

  if(toastContactsReloaded){
    if(isAndroid){
      ToastAndroid.show("Contacts Reloaded", ToastAndroid.SHORT);
    }
  }

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
          scrollsToTop={true}
          accessibilityLabel="Contacts List"
          enableEmptySections={true}
          dataSource={ds.cloneWithRows(contacts)}
          renderHeader={() => { return (<CBevegramStatusBar/>); }}
          renderRow={(rowData) =>
            <CContact
              name={rowData.name}
              birthday={rowData.birthday}
              imagePath={rowData.imagePath}
            />
          }
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={globalStyles.listRowSeparator} />}
          refreshControl={
            <RefreshControl
              refreshing={reloading}
              onRefresh={() => {
                if(!reloading){
                  reloadContacts(facebookToken);
                }
              }}
              title="Updating..."
              tintColor={globalColors.bevPrimary}
              progressViewOffset={50}
              colors={[globalColors.bevPrimary]}
            />
          }
          renderFooter={() => {
            return (
              <FacebookAppInviteButton />
            )
          }}
        />
      </View>
    )
  }
}

export default Contacts;

