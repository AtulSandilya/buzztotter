import { AppRegistry, StyleSheet, Text, TouchableHighlight, View, ViewPagerAndroid } from 'react-native';
import React, { Component, PropTypes } from 'react';

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import Branding from './src/Branding'
import Contacts from './src/Contacts'
import MainNavButtons from './src/MainNavButtons'

import {colors, styles} from './src/Styles'

import settings from './src/reducers'

function configureStore(settings){
  const store = createStore(settings);

  if(module.hot){
    module.hot.accept(() => {
      const nextRootReducer = require('./src/reducers/index').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

let store = configureStore(settings)

class Drinks extends Component {
  render() {
    return(
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text>
          No one has bought you a drink yet :(
        </Text>
      </View>
    );
  }
}

class BevegramLocations extends Component {
  render() {
    return(
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text>
          Coming Soon!
        </Text>
      </View>
    );
  }
}

class Deals extends Component {
  render() {
    return(
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text>
          Coming Soon!
        </Text>
      </View>
    );
  }
}

class MainUi extends Component {
  constructor(props){
    super(props);
    this.state = {
      menuPosition: 0,
    }
  }

  updateMenuPosition(newPosition){
    this.setState({
      menuPosition: newPosition,
    });
  }

  render() {
    return(
      <View style={{
        flex: 1,
      }}>
        <View style={{flex: 1}}>
          <Branding />
        </View>
        <View style={{flex: 8}}>
          <MainViewPager
            updateMenuPosition={this.updateMenuPosition.bind(this)}
            currentMenuPosition={this.state.menuPosition}
          />
        </View>
        <View style={{flex: 1}}>
          <MainNavButtons
            activeButtonPos={this.state.menuPosition}
            updateMenuPosition={this.updateMenuPosition.bind(this)}
          />
        </View>
      </View>
    );
  }
}

class MainViewPager extends Component {
  static propTypes = {
    updateMenuPosition: React.PropTypes.func,
    currentMenuPosition: React.PropTypes.number,
  }

  static defaultProps = {
    currentMenuPosition: 3,
  }

  onPageSelected(event){
    this.props.updateMenuPosition(event.nativeEvent.position);
  }

  componentWillReceiveProps(nextProps){
    this.viewPager.setPageWithoutAnimation(nextProps.currentMenuPosition);
  }

  render() {
    return(
      <ViewPagerAndroid
        style={{flex: 1}}
        initialPage={0}
        onPageSelected={this.onPageSelected.bind(this)}
        ref={viewPager => {this.viewPager = viewPager; }}
      >
        <View style={{flex: 1}}>
          <Contacts />
        </View>
        <View style={{flex: 1}}>
          <Drinks />
        </View>
        <View style={{flex: 1}}>
          <BevegramLocations />
        </View>
        <View style={{flex: 1}}>
          <Deals />
        </View>
      </ViewPagerAndroid>
    );
  }
}

class Bevegram extends Component {
  render() {
    return (
      <Provider store={store}>
        <MainUi />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('Bevegram', () => Bevegram);
