// import React, { Component, PropTypes } from 'react';
// import {AppRegistry, ListView, Dimensions, ScrollView, StyleSheet, Text, TextInput, Image, View, Navigator, TouchableHighlight, ViewPagerAndroid } from 'react-native';
import {ListView, Text, View, } from 'react-native';
import React, { Component} from 'react';

import Contact from './Contact'

export default class Contacts extends Component {
  constructor(props){
    super(props);

    // For the demo this data is hardcoded
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        {name: 'Fred', birthday: 'March 1', imagePath: 'test.jpg'},
        {name: 'Thomas', birthday: 'September 2', imagePath: 'test.jpg'},
        {name: 'Sara', birthday: 'December 3', imagePath: 'test.jpg'},
        {name: 'Fred', birthday: 'March 1', imagePath: 'test.jpg'},
        {name: 'Thomas', birthday: 'September 2', imagePath: 'test.jpg'},
        {name: 'Sara', birthday: 'December 3', imagePath: 'test.jpg'},
        {name: 'Fred', birthday: 'March 1', imagePath: 'test.jpg'},
        {name: 'Thomas', birthday: 'September 2', imagePath: 'test.jpg'},
        {name: 'Sara', birthday: 'December 3', imagePath: 'test.jpg'},
        {name: 'Fred', birthday: 'March 1', imagePath: 'test.jpg'},
        {name: 'Thomas', birthday: 'September 2', imagePath: 'test.jpg'},
        {name: 'Sara', birthday: 'December 3', imagePath: 'test.jpg'},
        {name: 'Fred', birthday: 'March 1', imagePath: 'test.jpg'},
        {name: 'Thomas', birthday: 'September 2', imagePath: 'test.jpg'},
        {name: 'Sara', birthday: 'December 3', imagePath: 'test.jpg'},
        {name: 'Fred', birthday: 'March 1', imagePath: 'test.jpg'},
        {name: 'Thomas', birthday: 'September 2', imagePath: 'test.jpg'},
        {name: 'Sara', birthday: 'December 3', imagePath: 'test.jpg'},
        {name: 'Fred', birthday: 'March 1', imagePath: 'test.jpg'},
        {name: 'Thomas', birthday: 'September 2', imagePath: 'test.jpg'},
        {name: 'Sara', birthday: 'December 3', imagePath: 'test.jpg'},
      ])
    }
  }

  render() {
    return(
      <View style={{flex: 1}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) =>
            <Contact
              name={rowData.name}
              birthday={rowData.birthday}
              imagePath={rowData.imagePath}
            />
          }
        />
      </View>
    );
  }
}
