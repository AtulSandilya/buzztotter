import * as React from "react";
import { Component } from "react";
import { View } from "react-native";

import { connect } from "react-redux";

import CBranding from "../containers/CBranding";
import CMainTabView from "../containers/CMainTabView";

import { BrandingHeight } from "./Branding";

import { WindowHeight, WindowWidth } from "../ReactNativeUtilities";

const MainUi = () =>
  <View
    style={{
      flex: 1,
      height: WindowHeight - BrandingHeight,
      left: 0,
      position: "absolute",
      top: BrandingHeight,
      width: WindowWidth,
    }}
  >
    <View style={{ flex: 1 }}>
      <CMainTabView />
    </View>
  </View>;

export default MainUi;
