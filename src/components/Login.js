import React, { Component, PropTypes } from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';

import {globalColors} from './GlobalStyles';

const Login = ({isLoggedIn, logInAction}) => (
  <View style={{flex: 1}}>
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: globalColors.bevPrimary}}>
      <Image
      source={require('../../img/logos/main-logo-big.png')}
      />
      <Text style={{
        fontSize: 25,
        marginTop: 35,
        color: '#333',
      }}
      >
        Send a Beer to a Friend!
      </Text>
    </View>
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View style={{flex: -1, alignItems: 'center'}}>
        <TouchableHighlight
          style={{
            backgroundColor: '#3b5998',
            padding: 15,
            borderRadius: 3,
          }}
          onPress={logInAction}
        >
          <Text style={{fontSize: 20, color: '#ffffff'}}>Import Contacts from Facebook</Text>
        </TouchableHighlight>
      </View>
      <View style={{flex: -1, alignItems: 'center', marginTop: 30}}>
        <TouchableHighlight
          style={{
            backgroundColor: '#dd4b39',
            padding: 15,
            borderRadius: 3,
          }}
          onPress={logInAction}
        >
          <Text style={{fontSize: 20, color: '#ffffff'}}>Import Contacts from Google</Text>
        </TouchableHighlight>
      </View>
      <View style={{flex: -1, alignItems: 'center', marginTop: 30, marginHorizontal: 30}}>
        <Text>
          * We only use your Contacts to send and receive Bevegrams.
          Your privacy is important to us. We promise to never share your information with anyone for any reason.
        </Text>
      </View>
    </View>
  </View>
)

Login.propTypes = {
  isLoggedIn: React.PropTypes.bool.isRequired,
}

export default Login;
