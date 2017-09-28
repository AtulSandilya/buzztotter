import * as React from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

import theme from "../theme";

/* tslint:disable:no-magic-numbers */
const calcDimensions = (dimensionProperty, innerSize) => {
  const full = Dimensions.get("window")[dimensionProperty];
  return {
    edge: (full - full * innerSize) / 2,
    full,
    inner: full * innerSize,
  };
};

interface CenteredModalProps {
  isVisible: boolean;
  bgOpacity?: number;
  heightPercent?: number;
  widthPercent?: number;
  children?: React.ReactChild;
  backgroundColor?: string;
  tappingAnywhereCloses?: boolean;
  onRequestClose?(): void;
}

const CenteredModal: React.StatelessComponent<CenteredModalProps> = ({
  children,
  isVisible = false,
  bgOpacity = 0.6,
  heightPercent = 0.8,
  widthPercent = 0.9,
  backgroundColor,
  tappingAnywhereCloses,
  onRequestClose,
}) => {
  const width = calcDimensions("width", widthPercent);
  const height = calcDimensions("height", heightPercent);

  return (
    <Modal
      animationType={"fade"}
      transparent={true}
      visible={isVisible}
      onRequestClose={() => onRequestClose()}
    >
      <View
        style={{
          height: height.full,
          width: width.full,
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(34, 34, 34, " + bgOpacity.toString() + ")",
            height: height.full,
            width: width.full,
            zIndex: 1,
          }}
        >
          <TouchableHighlight
            style={{
              height: height.full,
              width: width.full,
            }}
            underlayColor={"#222222"}
            onPress={() => onRequestClose()}
          >
            <Text> </Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight
          onPress={tappingAnywhereCloses ? onRequestClose : undefined}
          underlayColor="transparent"
          style={{
            backgroundColor: backgroundColor || "#ffffff",
            height: height.inner,
            left: width.edge,
            position: "absolute",
            top: height.edge,
            width: width.inner,
            zIndex: 100,
          }}
        >
          <ScrollView
            style={{
              borderRadius: theme.borderRadius,
              height: height.inner,
              zIndex: 110,
            }}
          >
            {children}
          </ScrollView>
        </TouchableHighlight>
      </View>
    </Modal>
  );
};

export default CenteredModal;
