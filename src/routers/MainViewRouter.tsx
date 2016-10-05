import * as React from "react";
import { Component, PropTypes } from 'react';
import { BackAndroid, Dimensions, Text, TouchableOpacity, View } from 'react-native';

import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

import {globalColors} from '../components/GlobalStyles';

import CContacts from '../containers/CContacts';
import CBevegrams from '../containers/CBevegrams';
import CBevegramLocations from '../containers/CBevegramLocations';

export interface MainViewRouterProps {
  currentPage?: string;
  maxScene?: number;
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

    // The way `ScrollableTabView` is structured you cannot easily use flex to
    // set the height of the button, This is a way to set the height to 10% of
    // the device height, a psuedo flex.
    const buttonHeight = Dimensions.get('window').height * 0.1;
    const buttonBgColor = globalColors.bevSecondary;
    const buttonSeparatorColor = globalColors.bevActiveSecondary;
    const buttonActiveColor = globalColors.bevActiveSecondary;
    const textSize = 14;
    const textColor = "#eeeeee";
    const activeTextColor = "#ffffff";
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
              }}
              renderTab={(name, page, isTabActive, onPressHandler) => {
                return (
                  <TouchableOpacity
                    key={name}
                    style={{
                      flex: 1,
                    }}
                    onPress={() => onPressHandler(page)}
                  >
                    <View
                      style={[{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }, page !== this.props.maxScene ? {
                        borderRightWidth: 1,
                        borderRightColor: buttonSeparatorColor,
                      } : {borderWidth: 0}]}
                    >
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
                  </TouchableOpacity>
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
        preRenderSiblingsNumber={Infinity}
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
