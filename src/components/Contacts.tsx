import * as React from "react";
import {
  Keyboard,
  LayoutAnimation,
  ListView,
  Modal,
  RefreshControl,
  StyleSheet,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  View,
} from "react-native";

import {
  isAndroid,
  StatusBarHeight,
  WindowHeight,
  WindowWidth,
} from "../ReactNativeUtilities";
import { BrandingHeight } from "./Branding";
import { globalColors, globalStyles } from "./GlobalStyles.js";

import { buildFacebookProfilePicUrlFromFacebookId } from "../api/facebook";
import BevText, { buildBevTextStyle } from "./BevText";

import CContact from "../containers/CContact";
import theme from "../theme";

import BevIcon from "./BevIcon";
import FacebookButton from "./FacebookButton";

import * as Utils from "../ReactNativeUtilities";
import { Contact } from "../reducers/contacts";
import {
  ContactsSortingMethod,
  ContactsSortOptionsViewLine,
} from "../reducers/contactsView";

export interface ContactsProps {
  tabLabel?: string;
  contacts?: [Contact];
  loading?: boolean;
  loadingFailed?: boolean;
  reloading?: boolean;
  reloadingFailed?: boolean;
  purchaseModalIsOpen?: boolean;
  toastContactsReloaded?: boolean;
  reloadContacts?: () => void;
  searchQuery?: string;
  activeSortingMethod?: ContactsSortingMethod;
  sortingMethodsList?: ContactsSortOptionsViewLine[];
  changeSortMethod?: (method: ContactsSortingMethod) => void;
  updateSearchQuery?: (query: string) => void;
  enteredSearchInput?: () => void;
  exitedSearchInput?: () => void;
  searchInputIsFocused?: boolean;
  isSortOptionsVisible?: boolean;
  inviteInProgress?: boolean;
  showSortOptions?: () => void;
  hideSortOptions?: () => void;
  showAppInvite?: () => void;
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
  showAppInvite,
  inviteInProgress,
}) => {
  const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

  if (toastContactsReloaded) {
    if (isAndroid) {
      ToastAndroid.show("Contacts Reloaded", ToastAndroid.SHORT);
    }
  }

  const QueryBarColor = theme.colors.uiBoldTextColor;
  const QueryBarHeight = 44;
  const QueryBarFontSize = "small";
  const isSearching = searchInputIsFocused || "" !== searchQuery;

  const QueryBarIcon = (props: { iconType: any; isBold?: boolean }) => {
    return (
      <BevIcon
        color={props.isBold ? QueryBarColor : undefined}
        iconType={props.iconType}
        size={"normal"}
        style={{
          paddingRight: theme.padding.extraSmall,
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          borderBottomColor: globalColors.subtleSeparator,
          borderBottomWidth: StyleSheet.hairlineWidth,
          flex: -1,
          flexDirection: "row",
          height: QueryBarHeight,
          paddingLeft: 8,
          zIndex: 1,
        }}
      >
        <TouchableHighlight
          style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            exitedSearchInput();
          }}
          underlayColor={"rgba(255, 255, 255, 1)"}
        >
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <QueryBarIcon iconType="search" />
            <TextInput
              style={[
                buildBevTextStyle({
                  size: QueryBarFontSize,
                  textStyle: {
                    color: QueryBarColor,
                    height: QueryBarHeight,
                    paddingTop: Utils.isIOS
                      ? theme.padding.extraExtraSmall
                      : Utils.isAndroid ? theme.padding.normal : 0,
                    width: 150,
                  },
                }),
              ]}
              autoCorrect={false}
              placeholder={"SEARCH"}
              placeholderTextColor={QueryBarColor}
              value={searchQuery}
              underlineColorAndroid="transparent"
              onChangeText={text => {
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
                Keyboard.addListener(
                  "keyboardWillHide",
                  () => {
                    exitedSearchInput();
                    Keyboard.removeListener("keyboardWillHide", null);
                  },
                  undefined,
                );
                hideSortOptions();
              }}
            />
            {isSearching ? (
              <TouchableHighlight
                underlayColor={"rgba(255, 255, 255, 1)"}
                onPress={() => {
                  exitedSearchInput();
                  updateSearchQuery("");
                  Keyboard.dismiss();
                  changeSortMethod("Upcoming Birthday");
                }}
              >
                <View>
                  <QueryBarIcon iconType="close" />
                </View>
              </TouchableHighlight>
            ) : (
              <View />
            )}
          </View>
        </TouchableHighlight>
        {!isSearching ? (
          <TouchableHighlight
            underlayColor={"rgba(255, 255, 255, 1)"}
            style={{
              alignItems: "flex-end",
              flex: 1,
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
            <View
              style={[
                {
                  alignItems: "center",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  paddingLeft: 4,
                  paddingRight: 8,
                },
              ]}
            >
              <QueryBarIcon iconType="sort" />
              <BevText
                color={QueryBarColor}
                size={QueryBarFontSize}
                textStyle={{
                  paddingTop: Utils.isIOS ? theme.padding.extraExtraSmall : 0,
                }}
              >
                SORT BY
              </BevText>
              {isSortOptionsVisible ? (
                <QueryBarIcon iconType="close" />
              ) : (
                <View />
              )}
            </View>
          </TouchableHighlight>
        ) : (
          <View />
        )}
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
              backgroundColor: "rgba(0, 0, 0, 0)",
              height: WindowHeight,
              width: WindowWidth,
            }}
            underlayColor={"rgba(255, 255, 255, 0.0)"}
            onPress={() => {
              hideSortOptions();
            }}
          >
            <View
              style={{
                backgroundColor: "#ffffff",
                elevation: 10,
                flex: -1,
                // Android Window Width includes the status bar and doesn't
                flexDirection: "column",
                position: "absolute",
                right: 0,
                shadowColor: "#333333",
                shadowOffset: {
                  height: 2,
                  width: -2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 0.95,
                top:
                  BrandingHeight -
                  (isAndroid ? StatusBarHeight : 0) +
                  QueryBarHeight,
                width: 150,
              }}
            >
              {sortingMethodsList.map((sortingMethod, id) => (
                <TouchableHighlight
                  underlayColor={"rgba(255, 255, 255, 1)"}
                  style={{
                    alignItems: "center",
                    backgroundColor:
                      sortingMethod.name === activeSortingMethod
                        ? "#cccccc"
                        : "#ffffff",
                    flex: -1,
                    flexDirection: "row",
                    height: QueryBarHeight,
                    padding: 8,
                    zIndex: 6,
                  }}
                  key={id}
                  onPress={() => {
                    LayoutAnimation.easeInEaseOut(undefined);
                    changeSortMethod(sortingMethod.name);
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      flex: 1,
                      flexDirection: "row",
                    }}
                  >
                    <QueryBarIcon
                      iconType={sortingMethod.icon}
                      isBold={sortingMethod.name === activeSortingMethod}
                    />
                    <BevText color={QueryBarColor} size={QueryBarFontSize}>
                      {sortingMethod.name.toUpperCase()}
                    </BevText>
                  </View>
                </TouchableHighlight>
              ))}
            </View>
          </TouchableHighlight>
        </Modal>
      </View>
      <ListView
        style={{ zIndex: 1 }}
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
        renderRow={rowData => (
          <CContact
            name={rowData.name}
            birthday={rowData.birthday}
            imagePath={buildFacebookProfilePicUrlFromFacebookId(
              rowData.facebookId,
            )}
            facebookId={rowData.facebookId}
          />
        )}
        renderSeparator={(sectionId, rowId) => (
          <View key={rowId} style={globalStyles.listRowSeparator} />
        )}
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
            progressViewOffset={theme.padding.hero}
            colors={[globalColors.bevPrimary]}
          />
        }
        renderFooter={() => {
          return (
            <View
              style={{
                alignItems: "center",
                flex: 1,
                paddingTop: theme.padding.normal,
              }}
            >
              <FacebookButton
                text="Invite Friends"
                size="normal"
                onPress={showAppInvite}
                showActivityIndicator={inviteInProgress}
                marginTop={theme.padding.large}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default Contacts;
