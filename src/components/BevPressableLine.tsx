import * as React from "react";
import {
  TouchableHighlight,
  View,
} from "react-native";

import RightArrow from "./RightArrow";

interface BevPressableLineProps {
  onPress: () => void;
  children: React.ReactChild;
}

const BevPressableLine: React.StatelessComponent<BevPressableLineProps> = (props) => {
  return (
    <TouchableHighlight
      onPress={props.onPress}
      style={{flex: 1}}
    >
      <View
        style={{
          alignItems: "center",
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}
      >
        {props.children}
        <RightArrow/>
      </View>
    </TouchableHighlight>
  );
};

export default BevPressableLine;
