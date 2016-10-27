import * as React from "react";
import { Component, PropTypes } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { connect } from 'react-redux';

import { Actions, Router, Scene } from 'react-native-router-flux';

import store from '../configureStore';

import {globalColors} from '../components/GlobalStyles';

import MainUi from '../components/MainUi';
import CLogin from '../containers/CLogin';
import CPurchaseBeer from '../containers/CPurchaseBeer';

interface Style {
  navBarStyle: React.ViewStyle;
  titleStyle: React.TextStyle;
}

const styles = StyleSheet.create<Style>({
  navBarStyle: {
    backgroundColor: globalColors.bevPrimary,
  },
  titleStyle: {
    color: '#ffffff',
  },
})

const scenes = (showLogin) => {
  return (
    Actions.create(
      <Scene key="root" hideNavBar={true}>
        <Scene key="loginScene" hideNavBar={true} component={CLogin} initial={showLogin}/>
        <Scene key="MainUi" hideNavBar={true} component={MainUi} panHandlers={null} initial={!showLogin}/>
        <Scene
          key="PurchaseBeer"
          title="Purchase Beer"
          component={CPurchaseBeer}
          backTitle="Contacts"
          hideNavBar={false}
          navigationBarStyle={styles.navBarStyle}
          titleStyle={styles.titleStyle}
          backButtonTextStyle={styles.titleStyle}
        />
      </Scene>
    )
  )
}

const CRouter = connect()(Router);

export interface InitialRouterProps {
  showLogin?: boolean;
  isLoading?: boolean;
}

export default class InitialRouter extends Component<InitialRouterProps, {}> {
  render() {
    if(this.props.isLoading) {
      return (
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text>Loading!</Text>
        </View>
      )
    }
    return(
      <CRouter
        scenes={scenes(this.props.showLogin)}
        backAndroidHandler={() => {return true;}}
      />
    );
  }
}
