import * as React from "react";
import { Component } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ViewStyle,
} from "react-native";

import BevButton from "./BevButton";
import BevUiText from "./BevUiText";

interface Styles {
  parentContainer: ViewStyle;
  infoContainer: ViewStyle;
  infoTextContainer: ViewStyle;
  buttonContainer: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  buttonContainer: {
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  infoContainer: {
    alignItems: "center",
    alignSelf: "center",
    flex: -1,
    flexDirection: "row",
    paddingLeft: 10,
  },
  infoTextContainer: {
    flex: -1,
    flexDirection: "column",
  },
  parentContainer: {
    flex: 1,
    flexDirection: "row",
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
        <Image source={{ uri: imagePath }} style={{ height: 50, width: 50 }} />
        <View style={styles.infoTextContainer}>
          <Text style={{ paddingLeft: 15, paddingBottom: 5 }}>{fullName}</Text>
          <BevUiText icon="birthday-cake" style={{ paddingLeft: 15 }}>
            {birthday}
          </BevUiText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <BevButton
          text={"Send Bevegram"}
          shortText="Send Bevegram"
          label="Send Bevegram Button"
          onPress={() =>
            openPurchaseRoute({
              facebookId: facebookId,
              firstName: name.first,
              fullName: fullName,
              imageUri: imagePath,
            })}
          rightIcon={true}
        />
      </View>
    </View>
  );
};

export default Contact;
