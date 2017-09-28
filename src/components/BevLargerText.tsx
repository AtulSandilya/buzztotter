import * as React from "react";
import { TextStyle } from "react-native";

import BevText, { buildBevTextStyle } from "./BevText";

export const BevLargerTextSize = "largeNormal";

const BevLargerText = (props: { children: string; style?: TextStyle }) => {
  return (
    <BevText size={BevLargerTextSize} textStyle={props.style}>
      {props.children}
    </BevText>
  );
};

export const BevLargerTextInputStyle = (width: number) => {
  return buildBevTextStyle({
    size: BevLargerTextSize,
    textStyle: {
      height: 40,
      textAlign: "center",
      width,
    },
  }) as any;
};

export default BevLargerText;
