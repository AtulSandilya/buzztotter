import * as React from "react";
import { Component} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  LayoutAnimation,
  ListView,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  View,
} from 'react-native';

import {globalStyles, globalColors} from './GlobalStyles.js';

import { isAndroid } from '../Utilities';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import CContact from '../containers/CContact';
import FacebookAppInviteButton from './FacebookAppInviteButton';
import CBevegramStatusBar from '../containers/CBevegramStatusBar';

import {Contact} from '../reducers/contacts';
import {ContactsSort, ContactsSortingMethod, ContactsSortOptionsViewLine} from '../reducers/contactsView';

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
  reloadContacts?(token: string);
  searchQuery?: string;
  activeSortingMethod?: ContactsSortingMethod;
  sortingMethodsList?: ContactsSortOptionsViewLine[];
  changeSortMethod?(ContactsSortingMethod);
  updateSearchQuery?(string);
  enteredSearchInput?();
  exitedSearchInput?();
  searchInputIsFocused?: boolean;
  isSortOptionsVisible?: boolean;
  showSortOptions?();
  hideSortOptions?();
}

const Contacts: React.StatelessComponent<ContactsProps> = ({
  contacts,
  loading,
  loadingFailed,
  reloading,
  reloadingFailed,
  facebookToken,
  toastContactsReloaded,
  purchaseModalIsOpen,
  reloadContacts,
  searchQuery,
  changeSortMethod,
  activeSortingMethod,
  sortingMethodsList,
  updateSearchQuery,
  searchInputIsFocused,
  enteredSearchInput,
  exitedSearchInput,
  isSortOptionsVisible,
  showSortOptions,
  hideSortOptions,
}) => {
  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

  if(toastContactsReloaded){
    if(isAndroid){
      ToastAndroid.show("Contacts Reloaded", ToastAndroid.SHORT);
    }
  }

  const headerColor = "#555555"
  const isSearching = searchInputIsFocused || "" !== searchQuery;

  return (
    <View style={{flex: 1}}>
      <View style={{
        flex: -1,
        flexDirection: 'row',
        paddingLeft: 8,
        height: 44,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: globalColors.subtleSeparator,
              zIndex: 10000000,
      }}>
        <TouchableHighlight
          style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}
          onPress={() => {
            exitedSearchInput();
          }}
          underlayColor={"rgba(255, 255, 255, 1)"}
        >
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome
              name={"search"}
              size={14}
              color={headerColor}
              style={{
                paddingRight: 7,
              }}
            />
            <TextInput
              style={{
                color: headerColor,
                fontSize: 10,
                height: 44,
                width: 150,
              }}
              autoCorrect={false}
              placeholder={"SEARCH"}
              placeholderTextColor={headerColor}
              value={searchQuery}
              onChangeText={(text) => {
                updateSearchQuery(text)
              }}
              onSubmitEditing={() => {
                Keyboard.dismiss();
                exitedSearchInput();
              }}
              returnKeyType={"search"}
              onFocus={() => {
                LayoutAnimation.easeInEaseOut(undefined);
                enteredSearchInput();
                Keyboard.addListener("keyboardWillHide", () => {
                  exitedSearchInput();
                  Keyboard.removeListener("keyboardWillHide", null);
                }, undefined);
                hideSortOptions();
              }}
            />
            {isSearching ?
              <TouchableHighlight
                underlayColor={"rgba(255, 255, 255, 1)"}
                onPress={() => {
                  exitedSearchInput();
                  updateSearchQuery("");
                  Keyboard.dismiss();
                  changeSortMethod("Upcoming Birthday");
                }}
              >
                <FontAwesome
                  name="times-circle"
                  size={14}
                  color={headerColor}
                  style={{
                    paddingRight: 7,
                  }}
                />
              </TouchableHighlight>
            :
            null}
          </View>
        </TouchableHighlight>
        {!isSearching ?
          <TouchableHighlight
            underlayColor={"rgba(255, 255, 255, 1)"}
            style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'center'
            }}
            onPress={() => {
              LayoutAnimation.easeInEaseOut(undefined);
              if(isSortOptionsVisible){
                hideSortOptions();
              } else {
                showSortOptions();
              }
            }}
          >
            <View style={[{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              paddingRight: 8,
              paddingLeft: 4,
            }]}>
              <FontAwesome
                name={"signal"}
                size={14}
                color={headerColor}
                style={{
                  top: -4,
                  paddingRight: 10,
                  transform: [{rotate: '270deg'}],
                }}
              />
              <Text
                style={{
                  color: headerColor,
                  fontSize: 10
                }}
              >
                  SORT BY
              </Text>
              {isSortOptionsVisible ?
                <FontAwesome
                  name={"times-circle"}
                  size={14}
                  color={headerColor}
                  style={{
                    paddingLeft: 10,
                  }}
                />
              : null}
            </View>
          </TouchableHighlight>
        : null}
        {isSortOptionsVisible  && !isSearching ?
          <View
            style={[{
              position: 'absolute',
              top: 43,
              right: 0,
              backgroundColor: '#ffffff',
              flex: -1,
              flexDirection: 'column',
              shadowColor: '#333333',
              shadowOpacity: 0.25,
              shadowRadius: 0.95,
              shadowOffset: {
                width: -2,
                height: 2,
              },
              elevation: 5,
            }]}
          >
            {sortingMethodsList.map((sortingMethod, id) => (
              <TouchableHighlight
                underlayColor={"rgba(255, 255, 255, 1)"}
                style={{
                  height: 44,
                  flexDirection: 'row',
                  flex: -1,
                  alignItems: 'center',
                  backgroundColor: sortingMethod.name === activeSortingMethod ? "#cccccc" : "#ffffff",
                  padding: 8,
                }}
                key={id}
                onPress={() => {
                  LayoutAnimation.easeInEaseOut(undefined);
                  changeSortMethod(sortingMethod.name);
                }}
              >
                <View style={{flexDirection: 'row'}}>
                  <FontAwesome
                    name={sortingMethod.icon}
                    size={14}
                    color={headerColor}
                    style={{
                      paddingRight: 10,
                    }}
                  />
                  <Text
                    style={{
                      color: headerColor,
                      fontSize: 10
                    }}
                  >
                    {sortingMethod.name.toUpperCase()}
                  </Text>
                </View>
              </TouchableHighlight>
            ))}
          </View>
        :
        null}
      </View>
      <ListView
        scrollsToTop={true}
        accessibilityLabel="Contacts List"
        enableEmptySections={true}
        dataSource={ds.cloneWithRows(contacts)}
        onScroll={() => {
          if(isSortOptionsVisible) {
            LayoutAnimation.easeInEaseOut(undefined);
            hideSortOptions()
          }
        }}
        renderRow={(rowData) =>
          <CContact
            name={rowData.name}
            birthday={rowData.birthday}
            imagePath={rowData.imagePath}
            facebookId={rowData.facebookId}
          />
        }
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={globalStyles.listRowSeparator} />}
        refreshControl={
          <RefreshControl
            refreshing={reloading || loading}
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

export default Contacts;

