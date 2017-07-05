import * as React from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

const calcDimensions = (dimensionProperty, innerSize) => {
  const full = Dimensions.get("window")[dimensionProperty];
  return {
    full: full,
    inner: full * innerSize,
    edge: (full - full * innerSize) / 2,
  };
};

interface CenteredModalProps {
  isVisible: boolean;
  bgOpacity?: number;
  heightPercent?: number;
  widthPercent?: number;
  children?: React.ReactChild;
  closeFromParent?(): void;
}

const CenteredModal: React.StatelessComponent<CenteredModalProps> = ({
  children,
  isVisible = false,
  bgOpacity = 0.6,
  heightPercent = 0.8,
  widthPercent = 0.9,
  closeFromParent,
}) => {
  const width = calcDimensions("width", widthPercent);
  const height = calcDimensions("height", heightPercent);

  return (
    <Modal
      animationType={"fade"}
      transparent={true}
      visible={isVisible}
      onRequestClose={() => closeFromParent()}
    >
      <View
        style={{
          height: height.full,
          width: width.full,
        }}
      >
        <View
          style={{
            height: height.full,
            width: width.full,
            backgroundColor: "rgba(34, 34, 34, " + bgOpacity.toString() + ")",
            zIndex: 1,
          }}
        >
          <TouchableHighlight
            style={{
              height: height.full,
              width: width.full,
            }}
            underlayColor={"#222222"}
            onPress={() => closeFromParent()}
          >
            <Text> </Text>
          </TouchableHighlight>
        </View>
        <View
          style={{
            height: height.inner,
            width: width.inner,
            backgroundColor: "#ffffff",
            position: "absolute",
            top: height.edge,
            left: width.edge,
            zIndex: 100,
          }}
        >
          <ScrollView style={{ zIndex: 100, height: height.inner }}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CenteredModal;
