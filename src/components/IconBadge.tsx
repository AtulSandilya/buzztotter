import * as React from "react";
import { Text, View } from "react-native";

interface IconBadgeProps {
  containerHeight: number;
  containerWidth: number;
  displayNumber: number;
}

const IconBadge: React.StatelessComponent<IconBadgeProps> = ({
  containerHeight,
  containerWidth,
  displayNumber,
}) => {
  if (displayNumber === 0) {
    return <View />;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column-reverse",
        height: containerHeight,
        left: 0,
        position: "absolute",
        top: 0,
        width: containerWidth,
        zIndex: 500,
      }}
    >
      <View style={{ flex: 1 }} />
      <View style={{ flex: 1, flexDirection: "row-reverse" }}>
        <View style={{ flex: 4, justifyContent: "center" }}>
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "rgba(255, 0, 0, 0.85)",
              borderRadius: 20,
              elevation: 1,
              flex: -1,
              justifyContent: "center",
              padding: 7,
              paddingVertical: 2,
              shadowColor: "#333333",
              shadowOffset: {
                height: 1,
                width: 1,
              },
              shadowOpacity: 0.35,
              shadowRadius: 1,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: "#ffffff",
                fontSize: 12,
              }}
            >
              {displayNumber}
            </Text>
          </View>
        </View>
        <View style={{ flex: 5 }} />
      </View>
    </View>
  );
};

export default IconBadge;
