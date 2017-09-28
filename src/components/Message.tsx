import * as React from "react";
import { TextInput, View } from "react-native";

import BevButton from "./BevButton";
import BevText, { buildBevTextStyle } from "./BevText";
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
            <BevText>{`Message for ${props.recipentName}`}</BevText>
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
            style={[
              buildBevTextStyle({}),
              {
                flex: 1,
                width: WindowWidth - containerPadding * 2,
              },
            ]}
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
            <BevButton
              onPress={props.clearMessage}
              text="Clear"
              shortText="Clear"
              iconType="close"
              type="tertiary"
            />
          </View>
          <View style={globalStyles.bevLineRight}>
            <BevButton
              onPress={props.onSubmit}
              text="Done"
              shortText="Done"
              iconType="success"
              type="primaryPositive"
            />
          </View>
        </View>
      </View>
    </RouteWithNavBarWrapper>
  );
};

export default Message;
