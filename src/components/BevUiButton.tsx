import * as React from "react";
import { TouchableHighlight, View, ViewStyle } from "react-native";

import theme from "../theme";

import BevUiText from "./BevUiText";

import { globalStyles } from "./GlobalStyles";

interface BevUiButtonProps {
  onPress: () => void;
  text: string;
  icon?: string;
  style?: ViewStyle;
  color?: string;
  left?: boolean;
}

const BevUiButton: React.StatelessComponent<BevUiButtonProps> = props => {
  return (
    <TouchableHighlight
      onPress={props.onPress}
      underlayColor={"#ffffff"}
      style={[
        props.left ? globalStyles.bevLineLeft : globalStyles.bevLineRight,
        props.style,
      ]}
    >
      <View style={{ flex: -1 }}>
        <BevUiText
          icon={props.icon ? props.icon : "check"}
          iconRight={props.left ? false : true}
          iconBold={true}
          fontSize={"massive"}
          isButton={true}
          text={props.text}
          fontStyle={{ fontWeight: "bold" }}
          color={props.color ? props.color : theme.colors.text}
        />
      </View>
    </TouchableHighlight>
  );
};

export default BevUiButton;
