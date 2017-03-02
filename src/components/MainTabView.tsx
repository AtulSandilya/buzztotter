import * as React from "react";
import { Component, PropTypes } from 'react';
import { BackAndroid, Dimensions, Text, TouchableHighlight, View } from 'react-native';

import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

import Icon from 'react-native-vector-icons/Ionicons';

import {isIOS, WindowWidth} from '../Utilities';

import {globalColors} from '../components/GlobalStyles';

import {TabIconBadges} from '../containers/CMainTabView';
import CContacts from '../containers/CContacts';
import CBevegrams from '../containers/CBevegrams';
import CBevegramLocations from '../containers/CBevegramLocations';
import IconBadge from './IconBadge';

export interface MainViewRouterProps {
  currentPage?: string;
  maxScene?: number;
  tabIconBadges?: TabIconBadges;
  onPageChange?(newScene: number): void;
  goBackPage?(): void;
}

export default class MainViewRouter extends Component<MainViewRouterProps, {}> {

  constructor(props){
    super(props);
    BackAndroid.addEventListener('hardwareBackPress', () => {
      this.props.goBackPage();
    });
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
        <Deals tabLabel="History" />
      </ScrollableTabView>
    );
  }
}

interface DealsProps {
  tabLabel: string;
}

class Deals extends Component<DealsProps, {}> {
  render() {
    return(
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text>
          Coming Soon!
        </Text>
      </View>
    );
  }
}
