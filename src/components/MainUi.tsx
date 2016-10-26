import * as React from "react";
import { Component, PropTypes } from 'react';
import { View } from 'react-native';

import {connect} from 'react-redux';

import CBranding from '../containers/CBranding';
import CMainTabView from '../containers/CMainTabView';

const MainUi = () => (
  <View style={{
    flex: 1,
  }}>
    <View style={{flex: 1}}>
      <CBranding />
    </View>
    <View style={{flex: 9}}>
      <CMainTabView />
    </View>
  </View>
)

export default MainUi;
