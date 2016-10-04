import * as React from "react";
import { Component, PropTypes } from 'react';
import { View, Text } from 'react-native';

import { connect } from 'react-redux';

import { Actions, Router, Scene } from 'react-native-router-flux';

import store from '../configureStore';

import MainUi from '../components/MainUi';
import CLogin from '../containers/CLogin';

const scenes = (showLogin) => {
  return (
    Actions.create(
      <Scene key="root" hideNavBar={true}>
        <Scene key="loginScene" hideNavBar={true} component={CLogin} initial={showLogin}/>
        <Scene key="mainScene" hideNavBar={true} component={MainUi} panHandlers={null} initial={!showLogin}/>
      </Scene>
    )
  )
}

const CRouter = connect()(Router);

interface Props {
  showLogin: boolean;
  isLoading: boolean;
}

export default class InitialRouter extends Component<Props, {}> {
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
