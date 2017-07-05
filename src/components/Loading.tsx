import * as React from "react";
import { View } from "react-native";

import * as Animatable from "react-native-animatable";

import { WindowWidth } from "../ReactNativeUtilities";
import theme from "../theme";

const Loading: React.StatelessComponent<{}> = () => {
  const sizeFactor = 0.8;
  const animationDuration = 2000;

  return (
    <View
      style={{
        backgroundColor: theme.colors.bevPrimary,
        flex: 1,
      }}
    >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Animatable.Image
          animation="rotate"
          duration={animationDuration}
          easing="ease-in-out"
          iterationCount="infinite"
          source={require("../../img/logos/android-just-otter-icon.png")}
          style={{
            height: WindowWidth * sizeFactor,
            width: WindowWidth * sizeFactor,
          }}
        />
      </View>
    </View>
  );
};

export default Loading;
