import * as React from "react";
import { Component } from "react";
import {
  BackHandler,
  Dimensions,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

import ScrollableTabView, { DefaultTabBar } from "react-native-scrollable-tab-view";

import Icon from "react-native-vector-icons/Ionicons";

import { isAndroid, isIOS, WindowWidth } from "../ReactNativeUtilities";

import { globalColors } from "../components/GlobalStyles";

import CBevegramLocations from "../containers/CBevegramLocations";
import CBevegrams from "../containers/CBevegrams";
import CContacts from "../containers/CContacts";
import CHistory from "../containers/CHistory";
import { TabIconBadges } from "../containers/CMainTabView";
import IconBadge from "./IconBadge";

export interface MainViewRouterProps {
  currentPage?: string;
  maxScene?: number;
  tabIconBadges?: TabIconBadges;
  onPageChange?(newScene: number): void;
  goBackPage?(): void;
  startNotificationListener?(): void;
  stopNotificationListener?(): void;
}

export default class MainViewRouter extends Component<MainViewRouterProps, {}> {
  constructor(props) {
    super(props);
    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.goBackPage();
    });
  }

  public componentDidMount() {
    this.props.startNotificationListener();
  }

  public componentWillUnmount() {
    this.props.stopNotificationListener();
  }

  public render() {
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
    /* tslint:disable:object-literal-sort-keys */
    const iconMap = {
      // Keys must match tabLabel
      Contacts: iconPrefix + "people",
      Bevegrams: "ios-beer", // Material design beer looks like trash
      Map: iconPrefix + "pin",
      History: iconPrefix + "refresh",
    };
    // DefaultTabBar -> renderTab is a hack based on the original renderTab method to add separators between the buttons
    return (
      <ScrollableTabView
        renderTabBar={() => {
          return (
            <DefaultTabBar
              style={{
                height: buttonHeight,
                flexDirection: "row",
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
                      style={[
                        {
                          flex: 1,
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        },
                        page !== this.props.maxScene
                          ? {
                              borderRightWidth: 1,
                              borderRightColor: buttonSeparatorColor,
                            }
                          : { borderWidth: 0 },
                      ]}
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
                          backgroundColor: "rgba(0, 0, 0, 0)",
                        }}
                      />
                      <Text
                        style={[
                          {
                            fontSize: textSize,
                            backgroundColor: "rgba(0, 0, 0, 0.0)",
                          },
                          isTabActive
                            ? { color: activeTextColor, fontWeight: "bold" }
                            : { color: textColor },
                        ]}
                      >
                        {name}
                      </Text>
                    </View>
                  </TouchableHighlight>
                );
              }}
            />
          );
        }}
        tabBarPosition="bottom"
        onChangeTab={input => {
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
