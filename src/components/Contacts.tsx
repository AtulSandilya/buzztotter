import * as React from "react";
import { Component} from "react";
import {
  ActivityIndicator,
  Keyboard,
  LayoutAnimation,
  ListView,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  View,
} from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { isAndroid, StatusBarHeight, WindowHeight, WindowWidth } from "../ReactNativeUtilities";
import {BrandingHeight} from "./Branding";
import {globalColors, globalStyles} from "./GlobalStyles.js";

import {buildFacebookProfilePicUrlFromFacebookId} from "../api/facebook";

import CBevegramStatusBar from "../containers/CBevegramStatusBar";
import CContact from "../containers/CContact";
import FacebookAppInviteButton from "./FacebookAppInviteButton";
import theme from "../theme";

import {Contact} from "../reducers/contacts";
import {ContactsSort, ContactsSortingMethod, ContactsSortOptionsViewLine} from "../reducers/contactsView";

export interface ContactsProps {
  tabLabel?: string;
  contacts?: [Contact];
  loading?: boolean;
  loadingFailed?: boolean;
  reloading?: boolean;
  reloadingFailed?: boolean;
  purchaseModalIsOpen?: boolean;
  toastContactsReloaded?: boolean;
  reloadContacts?();
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

  if (toastContactsReloaded) {
    if (isAndroid) {
      ToastAndroid.show("Contacts Reloaded", ToastAndroid.SHORT);
    }
  }

  const QueryBarColor = theme.colors.uiBoldTextColor;
  const QueryBarHeight = 44;
  const isSearching = searchInputIsFocused || "" !== searchQuery;

  return (
    <View style={{flex: 1}}>
      <View style={{
        flex: -1,
        flexDirection: "row",
        paddingLeft: 8,
        height: QueryBarHeight,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: globalColors.subtleSeparator,
        zIndex: 1,
      }}>
        <TouchableHighlight
          style={{flex: 1, flexDirection: "row", alignItems: "center"}}
          onPress={() => {
            exitedSearchInput();
          }}
          underlayColor={"rgba(255, 255, 255, 1)"}
        >
          <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
            <FontAwesome
              name={"search"}
              size={14}
              color={QueryBarColor}
              style={{
                paddingRight: 7,
              }}
            />
            <TextInput
              style={{
                color: QueryBarColor,
                fontSize: 10,
                height: QueryBarHeight,
                width: 150,
              }}
              autoCorrect={false}
              placeholder={"SEARCH"}
              placeholderTextColor={QueryBarColor}
              value={searchQuery}
              onChangeText={(text) => {
                updateSearchQuery(text);
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
                  color={QueryBarColor}
                  style={{
                    paddingRight: 7,
                  }}
                />
              </TouchableHighlight>
            :
            <View />}
          </View>
        </TouchableHighlight>
        {!isSearching ?
          <TouchableHighlight
            underlayColor={"rgba(255, 255, 255, 1)"}
            style={{
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "center",
            }}
            onPress={() => {
              LayoutAnimation.easeInEaseOut(undefined);
              if (isSortOptionsVisible) {
                hideSortOptions();
              } else {
                showSortOptions();
              }
            }}
          >
            <View style={[{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              paddingRight: 8,
              paddingLeft: 4,
            }]}>
              <FontAwesome
                name={"signal"}
                size={14}
                color={QueryBarColor}
                style={{
                  top: -4,
                  paddingRight: 10,
                  transform: [{rotate: "270deg"}],
                }}
              />
              <Text
                style={{
                  color: QueryBarColor,
                  fontSize: 10,
                }}
              >
                  SORT BY
              </Text>
              {isSortOptionsVisible ?
                <FontAwesome
                  name={"times-circle"}
                  size={14}
                  color={QueryBarColor}
                  style={{
                    paddingLeft: 10,
                  }}
                />
              : <View />}
            </View>
          </TouchableHighlight>
        : <View />}
        {/*
          A modal is used here because zIndex and position "absolute" don't play well on android.
          Weird Modal hacks include:
            * Absolute positioning
            * Fixed width
            * onRequestClose is the back button action on Android
          Cool Modal Things:
            * Allows creating a `TouchableHighlight` wrapper around the sort
              options dialog, allowing the user to exit by tapping anywhere
              outside the dialog
        */}
        <Modal
          visible={isSortOptionsVisible}
          transparent={true}
          animationType={"fade"}
          onRequestClose={() => {
            hideSortOptions();
          }}
        >
          <TouchableHighlight
            style={{
              height: WindowHeight,
              width: WindowWidth,
              backgroundColor: "rgba(0, 0, 0, 0)",
            }}
            underlayColor={"rgba(255, 255, 255, 0.0)"}
            onPress={() => {
              hideSortOptions();
            }}
          >
            <View
              style={{
                position: "absolute",
                backgroundColor: "#ffffff",
                flex: -1,
                // Android Window Width includes the status bar and doesn't
                top: BrandingHeight - (isAndroid ? StatusBarHeight : 0) + QueryBarHeight,
                right: 0,
                width: 150,
                flexDirection: "column",
                shadowColor: "#333333",
                shadowOpacity: 0.25,
                shadowRadius: 0.95,
                shadowOffset: {
                  width: -2,
                  height: 2,
                },
                elevation: 10,
              }}
            >
              {sortingMethodsList.map((sortingMethod, id) => (
                <TouchableHighlight
                  underlayColor={"rgba(255, 255, 255, 1)"}
                  style={{
                    height: QueryBarHeight,
                    flexDirection: "row",
                    flex: -1,
                    alignItems: "center",
                    backgroundColor: sortingMethod.name === activeSortingMethod ? "#cccccc" : "#ffffff",
                    padding: 8,
                    zIndex: 6,
                  }}
                  key={id}
                  onPress={() => {
                    LayoutAnimation.easeInEaseOut(undefined);
                    changeSortMethod(sortingMethod.name);
                  }}
                >
                  <View style={{flex: 1, flexDirection: "row"}}>
                    <FontAwesome
                      name={sortingMethod.icon}
                      size={14}
                      color={QueryBarColor}
                      style={{
                        paddingRight: 10,
                      }}
                    />
                    <Text
                      style={{
                        color: QueryBarColor,
                        fontSize: 10,
                      }}
                    >
                      {sortingMethod.name.toUpperCase()}
                    </Text>
                  </View>
                </TouchableHighlight>
              ))}
            </View>
          </TouchableHighlight>
        </Modal>
      </View>
      <ListView
        style={{zIndex: 1}}
        scrollsToTop={true}
        accessibilityLabel="Contacts List"
        enableEmptySections={true}
        dataSource={ds.cloneWithRows(contacts)}
        onScroll={() => {
          if (isSortOptionsVisible) {
            LayoutAnimation.easeInEaseOut(undefined);
            hideSortOptions();
          }
        }}
        renderRow={(rowData) =>
          <CContact
            name={rowData.name}
            birthday={rowData.birthday}
            imagePath={buildFacebookProfilePicUrlFromFacebookId(rowData.facebookId)}
            facebookId={rowData.facebookId}
          />
        }
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={globalStyles.listRowSeparator} />}
        refreshControl={
          <RefreshControl
            refreshing={reloading || loading}
            onRefresh={() => {
              if (!reloading) {
                reloadContacts();
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
          );
        }}
      />
    </View>
  );
};

export default Contacts;
