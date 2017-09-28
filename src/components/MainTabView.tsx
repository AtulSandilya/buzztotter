import * as React from "react";
import { Component } from "react";
import { BackHandler, TouchableHighlight, View } from "react-native";

import ScrollableTabView, {
  DefaultTabBar,
} from "react-native-scrollable-tab-view";

import Icon from "react-native-vector-icons/Ionicons";

import { isIOS, WindowWidth } from "../ReactNativeUtilities";
import theme from "../theme";

import { globalColors } from "../components/GlobalStyles";

import CBevegramLocations from "../containers/CBevegramLocations";
import CBevegrams from "../containers/CBevegrams";
import CContacts from "../containers/CContacts";
import CHistory from "../containers/CHistory";
import { TabIconBadges } from "../containers/CMainTabView";
import IconBadge from "./IconBadge";

import BevText from "./BevText";

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
    // When this component mounts we start listening for notifications and/or
    // handle any notification events
    this.props.startNotificationListener();
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
    const iconPrefix = isIOS ? "ios-" : "md-";
    const iconSizeMultiplier = 3;
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
                    underlayColor={"rgba(255, 255, 255, 0.2)"}
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
                          fontSize: textSize * iconSizeMultiplier,
                          backgroundColor: "rgba(0, 0, 0, 0)",
                        }}
                      />
                      <BevText
                        color={theme.colors.white}
                        size={"smallNormal"}
                        showTextShadow={true}
                      >
                        {name}
                      </BevText>
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
