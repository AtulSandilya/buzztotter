import * as React from "react";
import { Component} from 'react';
import {ActivityIndicator, ListView, RefreshControl, StyleSheet, Text, ToastAndroid, View, } from 'react-native';

import {globalStyles, globalColors} from './GlobalStyles.js';

import { isAndroid } from '../Utilities';

import CContact from '../containers/CContact';
import CenteredModal from './CenteredModal';
import CPurchaseBeer from '../containers/CPurchaseBeer';
import FacebookAppInviteButton from './FacebookAppInviteButton';

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
          accessibilityLabel="Contacts List"
          dataSource={ds.cloneWithRows(contacts)}
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
              title="Reloading Contacts"
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

