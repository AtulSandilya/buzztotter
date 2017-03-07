import * as React from "react";
import { Component, PropTypes } from 'react';
import { BackAndroid, Dimensions, Text, TouchableHighlight, View } from 'react-native';

import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

import Icon from 'react-native-vector-icons/Ionicons';

import {isAndroid, isIOS, WindowWidth} from '../Utilities';

import {globalColors} from '../components/GlobalStyles';

import {TabIconBadges} from '../containers/CMainTabView';
import CContacts from '../containers/CContacts';
import CBevegrams from '../containers/CBevegrams';
import CBevegramLocations from '../containers/CBevegramLocations';
import CHistory from '../containers/CHistory';
import IconBadge from './IconBadge';

import {NotificationActions} from '../api/notifications';
import store from '../configureStore'
import {sceneOrder, sceneKeys} from '../reducers/view';

export interface MainViewRouterProps {
  currentPage?: string;
  maxScene?: number;
  tabIconBadges?: TabIconBadges;
  onPageChange?(newScene: number): void;
  goBackPage?(): void;
}

export default class MainViewRouter extends Component<MainViewRouterProps, {}> {
  notificationListener: any;
  refreshTokenListener: any;

  constructor(props){
    super(props);
    BackAndroid.addEventListener('hardwareBackPress', () => {
      this.props.goBackPage();
    });
  }

  storeFCMToken(token) {
    store.dispatch({type: 'UPDATE_FCM_TOKEN', payload: {
      fcmToken: token
    }});
  }

  onNotificationClick(payload) {
    switch(payload.action) {
      case NotificationActions.ShowNewReceivedBevegrams:
        this.showNewReceivedBevegrams();
      case NotificationActions.ShowUpcomingBirthdays:
        store.dispatch({type: 'SEND_BEVEGRAM_TO_CONTACT_VIA_NOTIFICATION', payload: {
          facebookId: payload.facebookId,
        }})
      default:
        return;
    }
  }

  showNewReceivedBevegrams() {
    store.dispatch({type: 'GO_TO_ROUTE', payload: {
      route: "MainUi",
    }});
    store.dispatch({type: 'GOTO_VIEW', newScene: sceneOrder[sceneKeys.bevegrams]});
  }

  componentDidMount() {
    if(isAndroid){
      const FCM = require('react-native-fcm');
      // FCM.requestPermissions();
      // FCM.getFCMToken().then((token) => {
      //   this.storeFCMToken(token);
      // })

      this.notificationListener = FCM.on('notification', (payload) => {
        // There are 3 notification situations to handle here
        // 1. App is in the foreground
        // 2. App is in the background and notification clicked
        // (payload.opened_from_tray is 1)
        // 3. App is not running (caught in FCM.getInitialNotification)

        if(payload.open_from_tray === 1){
          this.onNotificationClick(payload);
        } else {
          switch(payload.action) {
            case NotificationActions.ShowNewReceivedBevegrams:
              store.dispatch({type: 'ADD_RECEIVED_BEVEGRAM_TO_BADGE', payload: {
                // Should this badge show the number of bevegrams received or
                // quantity: payload.quantity,
                quantity: 1,
              }})
              store.dispatch({type: 'FETCH_RECEIVED_BEVEGRAMS'});
            case NotificationActions.ShowUpcomingBirthdays:
              // Do other thing
            default:
              return;
          }
        }

      })

      FCM.getInitialNotification().then((payload) => {
        // getInitialNotification is clicking the notification when the app is
        // closed
        this.onNotificationClick(payload);
      })

      this.refreshTokenListener = FCM.on('refreshToken', (token) => {
        this.storeFCMToken(token);
      })
    }
  }

  componentWillUnmount() {
    if(isAndroid){
      this.notificationListener.remove();
      this.refreshTokenListener.remove();
    }
  }

  render() {
    // ScrollableTabView is a cross platform `ViewPagerAndroid`

    const numButtons = 4;
    const buttonHeight = 65;
    const buttonWidth = WindowWidth / numButtons;
    const buttonBgColor = globalColors.bevSecondary;
    const buttonSeparatorColor = globalColors.bevActiveSecondary;
    const buttonActiveColor = globalColors.bevActiveSecondary;
    const textSize = 12;
    const textColor = "#eeeeee";
    const activeTextColor = "#ffffff";
    const iconPrefix = isIOS ? "ios-" : "md-";
    const iconMap = {
      // Keys must match tabLabel
      Contacts: iconPrefix + "people",
      Bevegrams: "ios-beer", // Material design beer looks like trash
      Map: iconPrefix + "pin",
      History: iconPrefix + "refresh",
    }
    // DefaultTabBar -> renderTab is a hack based on the original renderTab method to add separators between the buttons
    return(
      <ScrollableTabView
        renderTabBar={() => {
          return (
            <DefaultTabBar
              style={{
                height: buttonHeight,
                flexDirection: 'row',
                borderWidth: 0,
                backgroundColor: buttonBgColor,
                elevation: 5,
              }}
              renderTab={(name, page, isTabActive, onPressHandler) => {
                return (
                  <TouchableHighlight
                    underlayColor={"rgba(0, 0, 0, 0)"}
                    key={name}
                    style={{
                      flex: 1,
                    }}
                    onPress={() => onPressHandler(page)}
                  >
                    <View
                      style={[{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }, page !== this.props.maxScene ? {
                        borderRightWidth: 1,
                        borderRightColor: buttonSeparatorColor,
                      } : {borderWidth: 0}]}
                    >
                      <IconBadge
                        containerHeight={buttonHeight}
                        containerWidth={buttonWidth}
                        displayNumber={this.props.tabIconBadges[name]}
                      />
                      <Icon
                        name={iconMap[name]}
                        style={{
                          color: "#ffffff",
                          fontSize: textSize * 3,
                          backgroundColor: 'rgba(0, 0, 0, 0)'
                        }}
                      />
                      <Text
                      style={[
                        {
                          fontSize: textSize,
                          backgroundColor: 'rgba(0, 0, 0, 0.0)',
                        },
                        isTabActive ?
                          {color: activeTextColor, fontWeight: 'bold'}
                        :
                          {color: textColor}
                      ]}
                      >
                        {name}
                      </Text>
                    </View>
                  </TouchableHighlight>
                )
              }}
            />
          )
        }}
        tabBarPosition="bottom"
        onChangeTab={(input) => {
          this.props.onPageChange(input.i);
        }}
        initialPage={0}
        page={this.props.currentPage}
        prerenderingSiblingsNumber={Infinity}
        tabBarUnderlineStyle={{
          height: buttonHeight,
          backgroundColor: buttonActiveColor,
          zIndex: -1,
        }}
      >
        <CContacts tabLabel="Contacts" />
        <CBevegrams tabLabel="Bevegrams" />
        <CBevegramLocations tabLabel="Map" />
        <CHistory tabLabel="History" />
      </ScrollableTabView>
    );
  }
}
