import * as React from "react";
import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";

import BevButton from "./BevButton";
import BevTimestamp from "./BevTimestamp";

interface Style {
  parentContainer: ViewStyle;
  infoContainer: ViewStyle;
  infoTextContainer: ViewStyle;
  buttonContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  buttonContainer: {
    alignItems: "flex-end",
    alignSelf: "center",
    flex: -1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  infoContainer: {
    alignItems: "center",
    alignSelf: "center",
    flex: 2,
    flexDirection: "row",
    paddingLeft: 10,
  },
  infoTextContainer: {
    flex: 1,
    flexDirection: "column",
    paddingLeft: 15,
  },
  parentContainer: {
    flex: 1,
    flexDirection: "row",
  },
});

export interface SelectedBevegramPackage {
  id: string;
  from: string;
  quantity: number;
}

export interface BevegramProps {
  from: string;
  date: number;
  id: string;
  imagePath: string;
  quantity: number;
  displayAsUnseen: boolean;
  goToRedeem?(routeData: SelectedBevegramPackage): void;
}

const Bevegram: React.StatelessComponent<BevegramProps> = ({
  from,
  date,
  id,
  quantity,
  goToRedeem,
  imagePath,
  displayAsUnseen,
}) =>
  <View style={styles.parentContainer}>
    <View style={styles.infoContainer}>
      <Image
        source={
          imagePath
            ? { uri: imagePath }
            : require("../../img/icons/bev-contact.png")
        }
        style={{ height: 50, width: 50 }}
      />
      <View style={styles.infoTextContainer}>
        <Text
          style={[
            { paddingBottom: 5 },
            displayAsUnseen ? { fontWeight: "bold" } : {},
          ]}
        >
          {from}
        </Text>
        <BevTimestamp date={date} />
      </View>
    </View>
    <View style={styles.buttonContainer}>
      <BevButton
        text={`Redeem ${quantity} Bevegram${quantity === 1 ? "" : "s"}`}
        shortText="Redeem"
        label="Redeem Bevegram Button"
        onPress={() => goToRedeem({ id: id, from: from, quantity: quantity })}
        rightIcon={true}
      />
    </View>
  </View>;

export default Bevegram;
