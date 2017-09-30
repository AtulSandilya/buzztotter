import * as React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import BevAvatar from "./BevAvatar";
import BevButton from "./BevButton";
import BevText from "./BevText";
import BevUiText from "./BevUiText";

import * as RNUtils from "../ReactNativeUtilities";
import theme from "../theme";

interface Styles {
  parentContainer: ViewStyle;
  infoContainer: ViewStyle;
  infoTextContainer: ViewStyle;
  buttonContainer: ViewStyle;
}

export const styles = StyleSheet.create<Styles>({
  buttonContainer: {
    alignItems: "center",
    alignSelf: "center",
    flex: -1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  infoContainer: {
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
    flexDirection: "row",
  },
  infoTextContainer: {
    flex: -1,
    flexDirection: "column",
    paddingLeft: RNUtils.isNarrow ? theme.padding.small : theme.padding.normal,
  },
  parentContainer: {
    flex: 1,
    flexDirection: "row",
    padding: RNUtils.isNarrow
      ? theme.padding.extraExtraSmall
      : theme.padding.extraSmall,
  },
});

interface Name {
  first: string;
  last: string;
}

export interface ContactProps {
  name?: Name;
  birthday?: string;
  imagePath?: string;
  facebookId?: string;
  openPurchaseRoute?(Object): void;
  closePurchaseRoute?(): void;
}

const Contact: React.StatelessComponent<ContactProps> = ({
  name,
  birthday,
  imagePath,
  facebookId,
  openPurchaseRoute,
  closePurchaseRoute,
}) => {
  const fullName = name.first + " " + name.last;
  return (
    <View style={styles.parentContainer}>
      <View style={styles.infoContainer}>
        <BevAvatar imageUrl={imagePath} />
        <View style={styles.infoTextContainer}>
          <BevText textStyle={{ paddingBottom: theme.padding.extraExtraSmall }}>
            {fullName}
          </BevText>
          <BevUiText icon="birthday">{birthday}</BevUiText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <BevButton
          iconType="send"
          text={"Send Bevegram"}
          shortText="Bevegram"
          label="Send Bevegram Button"
          isListButton={true}
          onPress={() =>
            openPurchaseRoute({
              facebookId,
              firstName: name.first,
              fullName,
              imageUri: imagePath,
            })}
        />
      </View>
    </View>
  );
};

export default Contact;
