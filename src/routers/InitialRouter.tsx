import * as React from "react";
import { Component, PropTypes } from 'react';
import { View, Text } from 'react-native';

import { connect } from 'react-redux';

import { Actions, Router, Scene } from 'react-native-router-flux';

import store from '../configureStore';

import {globalColors} from '../components/GlobalStyles';

import MainUi from '../components/MainUi';
import CLogin from '../containers/CLogin';
import CPurchaseBeer from '../containers/CPurchaseBeer';

const scenes = (showLogin) => {
  return (
    Actions.create(
      <Scene key="root" hideNavBar={true}>
        <Scene key="loginScene" hideNavBar={true} component={CLogin} initial={showLogin}/>
        <Scene key="MainUi" hideNavBar={true} component={MainUi} panHandlers={null} initial={!showLogin}/>
        <Scene
          key="PurchaseBeer"
          title="Purchase Beer"
          hideNavBar={false}
          component={CPurchaseBeer}
          navigationBarStyle={{
            backgroundColor: globalColors.bevPrimary,
          }}
          titleStyle={{
            color: '#ffffff',
          }}
          backTitle="Contacts"
          backButtonTextStyle={{color: '#ffffff'}}
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
