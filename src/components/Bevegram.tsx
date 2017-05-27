import * as React from "react";
import { Component } from "react";
import { Image, StyleSheet, Text, TouchableHighlight, View, ViewStyle} from "react-native";

import { connect } from "react-redux";
import { modalKeys } from "../reducers/modals.js";

import BevButton from "./BevButton";
import BevTimestamp from "./BevTimestamp";

interface Style {
  parentContainer: ViewStyle;
  infoContainer: ViewStyle;
  infoTextContainer: ViewStyle;
  buttonContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  parentContainer: {
    flex: 1,
    flexDirection: "row",
  },
  infoContainer: {
    flex: 2,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    paddingLeft: 10,
  },
  infoTextContainer: {
    flex: 1,
    flexDirection: "column",
    paddingLeft: 15,
  },
  buttonContainer: {
    flex: -1,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
});

interface DataForRoute {
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
  goToRedeem?(routeData: DataForRoute): void;
}

const Bevegram: React.StatelessComponent<BevegramProps> = ({from, date, id, quantity, goToRedeem, imagePath}) => (
  <View style={styles.parentContainer}>
    <View style={styles.infoContainer}>
      <Image
        source={imagePath ?
          {uri: imagePath}
        :
          require("../../img/icons/bev-contact.png")
        }
        style={{height: 50, width: 50}}
      />
      <View style={styles.infoTextContainer}>
        <Text style={{paddingBottom: 5}}>{from}</Text>
        <BevTimestamp
          date={date}
        />
      </View>
    </View>
    <View style={styles.buttonContainer}>
      <BevButton
        text={`Redeem ${quantity} Bevegram${quantity === 1 ? "" : "s"}`}
        shortText="Redeem"
        label="Redeem Bevegram Button"
        onPress={() => goToRedeem({id: id, from: from, quantity: quantity})}
        rightIcon={true}
      />
    </View>
  </View>
);

export default Bevegram;
