import * as React from "react";

import Ionicon from "react-native-vector-icons/Ionicons";

import theme from "../theme";

const RightArrow: React.StatelessComponent<{}> = () =>
  <Ionicon
    name="ios-arrow-forward"
    style={{
      color: theme.colors.uiLight,
      fontSize: 35,
      paddingLeft: 15,
    }}
  />;

export default RightArrow;
