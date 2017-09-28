import * as React from "react";
import { StyleSheet, View } from "react-native";

import theme from "../theme";

import BevAvatar from "./BevAvatar";
import BevButton from "./BevButton";
import BevText from "./BevText";
import BevTimestamp from "./BevTimestamp";
import BevUiText from "./BevUiText";
import CenteredModal from "./CenteredModal";

interface MessageModalProps {
  date: number;
  from: string;
  isVisible: boolean;
  message: string;
  onRequestClose: () => void;
  photoUrl: string;
}

const MessageModal: React.StatelessComponent<MessageModalProps> = props => {
  const outerPadding = theme.padding.normal;
  const modalPercentHeight = 0.5;
  return (
    <CenteredModal
      isVisible={props.isVisible}
      onRequestClose={props.onRequestClose}
      heightPercent={modalPercentHeight}
      backgroundColor="transparent"
      tappingAnywhereCloses={true}
    >
      <View>
        <View
          style={{
            backgroundColor: theme.colors.bevPrimary,
            borderTopLeftRadius: theme.borderRadius,
            borderTopRightRadius: theme.borderRadius,
            paddingHorizontal: outerPadding,
            paddingVertical: theme.padding.extraSmall,
          }}
        >
          <BevUiText
            fontSize="normal"
            icon="messageUnread"
            preserveCase={true}
            color={theme.colors.white}
            iconColor={theme.colors.white}
          >
            {""}
          </BevUiText>
        </View>
        <View
          style={{
            alignItems: "center",
            backgroundColor: theme.colors.bg.offWhite,
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            paddingHorizontal: theme.padding.small,
            paddingVertical: theme.padding.small,
          }}
        >
          <BevAvatar imageUrl={props.photoUrl} size="extraExtraLarge" />
          <View
            style={{
              flexDirection: "column",
              paddingLeft: theme.padding.small,
            }}
          >
            <BevText textStyle={{ paddingBottom: theme.padding.extraSmall }}>
              {props.from}
            </BevText>
            <BevTimestamp date={props.date} />
          </View>
        </View>
        <View
          style={{
            backgroundColor: theme.colors.bg.white,
            borderBottomColor: theme.colors.uiLight,
            borderBottomWidth: StyleSheet.hairlineWidth,
            padding: outerPadding,
          }}
        >
          <BevText>{props.message}</BevText>
        </View>
        <View
          style={{
            alignItems: "center",
            backgroundColor: theme.colors.bg.white,
            borderBottomLeftRadius: theme.borderRadius,
            borderBottomRightRadius: theme.borderRadius,
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
            paddingHorizontal: outerPadding,
            paddingVertical: theme.padding.small,
          }}
        >
          <BevButton
            text="Close"
            shortText="Close"
            onPress={props.onRequestClose}
            iconType="close"
            isListButton={true}
          />
        </View>
      </View>
    </CenteredModal>
  );
};

export default MessageModal;
