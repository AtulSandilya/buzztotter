import * as React from "react";
import { TouchableHighlight, View } from "react-native";

import theme from "../theme";

import BevUiText, { BevUiTextProps } from "./BevUiText";

interface BevUiButtonProps extends BevUiTextProps {
  onPress: () => void;
}

const BevUiButton: React.StatelessComponent<BevUiButtonProps> = props => {
  return (
    <TouchableHighlight
      onPress={props.onPress}
      underlayColor={"#ffffff"}
      style={{ padding: theme.padding.small }}
    >
      <View style={{ flex: -1 }}>
        <BevUiText {...props}>
          {props.children}
        </BevUiText>
      </View>
    </TouchableHighlight>
  );
};

export default BevUiButton;
