import * as React from "react";
import { Text, TextInput, TouchableHighlight, View } from "react-native";

import BevUiText from "./BevUiText";
import RouteWithNavBarWrapper from "./RouteWithNavBarWrapper";

import { MESSAGE_MAX_CHARS } from "../db/tables";
import { WindowWidth } from "../ReactNativeUtilities";
import { globalColors, globalStyles } from "./GlobalStyles";

export interface MessageProps {
  message?: string;
  recipentName?: string;
  onSubmit?: () => void;
  clearMessage?: () => void;
  saveMessage?: (message: string) => void;
}

/* tslint:disable:no-magic-numbers */
const Message: React.StatelessComponent<MessageProps> = props => {
  const containerPadding = 15;
  return (
    <RouteWithNavBarWrapper>
      <View style={{ padding: containerPadding }}>
        <View style={[globalStyles.bevLine, { marginBottom: 10 }]}>
          <View style={globalStyles.bevLineLeft}>
            <Text>{`Message for ${props.recipentName}`}</Text>
          </View>
        </View>
        <View
          style={[
            globalStyles.bevLine,
            {
              flex: 1,
              paddingBottom: 15,
              width: WindowWidth - containerPadding * 2,
            },
          ]}
        >
          <TextInput
            autoFocus={true}
            blurOnSubmit={false}
            placeholder="Enter your message here..."
            placeholderTextColor={globalColors.subtleSeparator}
            style={{
              flex: 1,
              fontSize: 14,
              width: WindowWidth - containerPadding * 2,
            }}
            multiline={true}
            numberOfLines={
              props.message ? Math.round(props.message.length / 60) + 1 : 1
            }
            value={props.message}
            maxLength={MESSAGE_MAX_CHARS}
            onChangeText={text => {
              props.saveMessage(text);
            }}
            underlineColorAndroid={"rgba(0, 0, 0, 0)"}
          />
        </View>
        <View style={globalStyles.bevLineNoSep}>
          <View style={globalStyles.bevLineLeft}>
            <TouchableHighlight
              onPress={() => props.clearMessage()}
              underlayColor={"#ffffff"}
              style={globalStyles.bevLineRight}
            >
              <View>
                <BevUiText
                  icon="times"
                  iconBold={true}
                  fontSize={"large"}
                  isButton={true}
                >
                  Clear
                </BevUiText>
              </View>
            </TouchableHighlight>
          </View>
          <View style={globalStyles.bevLineRight}>
            <TouchableHighlight
              onPress={() => props.onSubmit()}
              underlayColor={"#ffffff"}
              style={globalStyles.bevLineRight}
            >
              <View>
                <BevUiText
                  icon="check"
                  iconBold={true}
                  fontSize={"large"}
                  isButton={true}
                >
                  Save and Continue
                </BevUiText>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </RouteWithNavBarWrapper>
  );
};

export default Message;
