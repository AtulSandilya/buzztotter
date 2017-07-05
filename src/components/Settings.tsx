import * as React from "react";
import {
  Linking,
  StyleSheet,
  Switch,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { settingsKeys } from "../reducers/settings";

import BevButton from "./BevButton";
import FacebookButton from "./FacebookButton";
import RouteWithNavBarWrapper from "./RouteWithNavBarWrapper";

import { globalColors } from "./GlobalStyles";

interface Style {
  settingLine: ViewStyle;
}

const linePadding = 8;

const styles = StyleSheet.create<Style>({
  settingLine: {
    borderBottomWidth: 1,
    borderColor: globalColors.subtleSeparator,
    flex: 1,
    flexDirection: "row",
    paddingVertical: linePadding,
  },
});

interface SettingsProps {
  notifications: boolean;
  location: boolean;
  version: string;
  fullName: string;
  onSettingToggle(setting): void;
  toggleNotificationSetting(): void;
  logoutActions(): void;
}

export const Settings: React.StatelessComponent<SettingsProps> = ({
  notifications,
  location,
  version,
  fullName,
  onSettingToggle,
  toggleNotificationSetting,
  logoutActions,
}) => {
  const supportEmail = "support@buzzotter.com";
  const emailSubject = `Support request regarding BuzzOtter version ${version}`;
  const emailLink = `mailto:${supportEmail}?subject=${encodeURIComponent(
    emailSubject,
  )}`;

  return (
    <RouteWithNavBarWrapper>
      <View
        style={{
          flex: 1,
          padding: 20,
        }}
      >
        <SettingLine>
          <SettingLeft>
            <SettingName>You:</SettingName>
            <SettingNameLight>{fullName}</SettingNameLight>
          </SettingLeft>
          <SettingRight>
            <View
              style={{
                alignItems: "flex-end",
                flex: 1,
                justifyContent: "flex-end",
              }}
            >
              <FacebookButton
                text="Log Out"
                size="normal"
                onPress={logoutActions}
              />
            </View>
          </SettingRight>
        </SettingLine>
        <SettingLine>
          <SettingLeft>
            <SettingName>Notifications:</SettingName>
          </SettingLeft>
          <SettingRight>
            <Switch
              onValueChange={() => toggleNotificationSetting()}
              value={notifications}
            />
          </SettingRight>
        </SettingLine>
        <SettingLine>
          <SettingLeft>
            <SettingName>Location:</SettingName>
          </SettingLeft>
          <SettingRight>
            <Switch
              onValueChange={() => onSettingToggle(settingsKeys.location)}
              value={location}
            />
          </SettingRight>
        </SettingLine>
        <SettingLine>
          <SettingLeft>
            <SettingName>Version:</SettingName>
          </SettingLeft>
          <SettingRight>
            <SettingNameLight>{version}</SettingNameLight>
          </SettingRight>
        </SettingLine>
        <SettingLine style={{ paddingVertical: 0 }}>
          <SettingLeft>
            <SettingName>Support:</SettingName>
          </SettingLeft>
          <SettingRight>
            <BevButton
              text={"Email Support"}
              shortText={"Email Support"}
              label={"Email Support Button"}
              fontAwesomeLeftIcon={"life-ring"}
              margin={linePadding}
              rightIcon={true}
              onPress={() => {
                Linking.canOpenURL(emailLink).then(supported => {
                  if (supported) {
                    Linking.openURL(emailLink);
                  } else {
                    alert(`Please send an email to ${supportEmail}`);
                  }
                });
              }}
            />
          </SettingRight>
        </SettingLine>
      </View>
    </RouteWithNavBarWrapper>
  );
};

const SettingLeft = props =>
  <View
    style={{
      alignItems: "flex-start",
      flex: 1,
      justifyContent: "center",
    }}
  >
    {props.children}
  </View>;

const SettingRight = props =>
  <View
    style={{
      alignItems: "flex-end",
      flex: -1,
      justifyContent: "center",
    }}
  >
    {props.children}
  </View>;

const SettingLine = props =>
  <View style={[styles.settingLine, props.style ? props.style : {}]}>
    {props.children}
  </View>;

const SettingName = props =>
  <Text style={{ fontSize: 20, fontWeight: "bold" }}>{props.children}</Text>;

const SettingNameLight = props =>
  <Text style={{ fontSize: 20 }}>{props.children}</Text>;
