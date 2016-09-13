import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';

import {connect} from 'react-redux';

import CBranding from '../containers/CBranding';
import MainNavButtons from './MainNavButtons';
import MainViewRouter from '../routers/MainViewRouter';

const MainUi = () => (
  <View style={{
    flex: 1,
  }}>
    <View style={{flex: 1}}>
      <CBranding />
    </View>
    <View style={{flex: 8}}>
      <MainViewRouter />
    </View>
    <View style={{flex: 1}}>
      <MainNavButtons />
    </View>
  </View>
)

export default MainUi;
